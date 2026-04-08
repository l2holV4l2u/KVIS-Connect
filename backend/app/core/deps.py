from fastapi import Depends, HTTPException, Cookie
from sqlmodel import Session
from typing import Optional
from app.core.database import get_session
from app.core.security import decode_token
from app.models.user import User


def get_current_user(
    access_token: Optional[str] = Cookie(default=None),
    session: Session = Depends(get_session),
) -> User:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_token(access_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def get_optional_user(
    access_token: Optional[str] = Cookie(default=None),
    session: Session = Depends(get_session),
) -> Optional[User]:
    if not access_token:
        return None
    user_id = decode_token(access_token)
    if not user_id:
        return None
    return session.get(User, user_id)
