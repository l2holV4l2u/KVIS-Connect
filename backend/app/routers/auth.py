from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import RedirectResponse
from sqlmodel import Session, select
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from app.core.database import get_session
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

# Microsoft OAuth setup
config = Config(environ={
    "MICROSOFT_CLIENT_ID": settings.MICROSOFT_CLIENT_ID,
    "MICROSOFT_CLIENT_SECRET": settings.MICROSOFT_CLIENT_SECRET,
})
oauth = OAuth(config)
oauth.register(
    name="microsoft",
    client_id=settings.MICROSOFT_CLIENT_ID,
    client_secret=settings.MICROSOFT_CLIENT_SECRET,
    server_metadata_url=f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

KVIS_DOMAIN = "kvis.ac.th"

COOKIE_OPTS = dict(httponly=True, samesite="lax", secure=False)  # set secure=True in production


def _set_auth_cookies(response: Response, user_id: int):
    response.set_cookie("access_token", create_access_token(user_id), max_age=3600, **COOKIE_OPTS)
    response.set_cookie("refresh_token", create_refresh_token(user_id), max_age=86400 * 30, **COOKIE_OPTS)


@router.post("/register")
def register(body: RegisterRequest, response: Response, session: Session = Depends(get_session)):
    if not body.email.endswith(f"@{KVIS_DOMAIN}"):
        raise HTTPException(400, detail="Only @kvis.ac.th emails are allowed")

    existing = session.exec(select(User).where(User.email == body.email)).first()
    if existing:
        raise HTTPException(400, detail="Email already registered")

    if len(body.password) < 6:
        raise HTTPException(400, detail="Password must be at least 6 characters")

    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        first_name=body.first_name,
        last_name=body.last_name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    _set_auth_cookies(response, user.id)
    return {"message": "Registered successfully", "user_id": user.id}


@router.post("/login")
def login(body: LoginRequest, response: Response, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == body.email)).first()
    if not user or not user.hashed_password or not verify_password(body.password, user.hashed_password):
        raise HTTPException(401, detail="Invalid credentials")

    _set_auth_cookies(response, user.id)
    return {"message": "Logged in", "user_id": user.id}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


# Microsoft OAuth
@router.get("/microsoft")
async def microsoft_login(request: Request):
    redirect_uri = f"{request.base_url}api/auth/microsoft/callback"
    return await oauth.microsoft.authorize_redirect(request, redirect_uri)


@router.get("/microsoft/callback")
async def microsoft_callback(request: Request, session: Session = Depends(get_session)):
    token = await oauth.microsoft.authorize_access_token(request)
    userinfo = token.get("userinfo") or await oauth.microsoft.userinfo(token=token)

    ms_id = userinfo["sub"]
    email = userinfo.get("email") or userinfo.get("preferred_username", "")

    user = session.exec(select(User).where(User.microsoft_id == ms_id)).first()
    if not user:
        # Check if email already exists
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            user.microsoft_id = ms_id
            user.email_verified = True
        else:
            name_parts = userinfo.get("name", "").split(" ", 1)
            user = User(
                email=email,
                microsoft_id=ms_id,
                first_name=name_parts[0] if name_parts else "",
                last_name=name_parts[1] if len(name_parts) > 1 else "",
                email_verified=True,
            )
        session.add(user)
        session.commit()
        session.refresh(user)

    response = RedirectResponse(url=f"{settings.FRONTEND_URL}/edit")
    _set_auth_cookies(response, user.id)
    return response
