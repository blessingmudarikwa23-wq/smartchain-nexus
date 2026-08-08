from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.models import User
from app.auth.security import (
    SECRET_KEY,
    ALGORITHM,
    oauth2_scheme,
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


def get_current_procurement(
    current_user: User = Depends(get_current_user),
):
    if current_user.role.lower() != "procurement":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Procurement access required",
        )

    return current_user


def get_current_warehouse(
    current_user: User = Depends(get_current_user),
):
    if current_user.role.lower() != "warehouse":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Warehouse access required",
        )

    return current_user