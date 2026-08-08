from sqlalchemy.orm import Session

from app.auth.models import User
from app.auth.schemas import UserCreate, UserLogin
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
)


def register_user(
    user: UserCreate,
    db: Session,
):
    # Check email
    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise ValueError("Email already exists.")

    # Check username
    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise ValueError("Username already exists.")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
        department=user.department,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(
    user_data: UserLogin,
    db: Session,
):
    user = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if user is None:
        return None

    if not verify_password(
        user_data.password,
        user.hashed_password,
    ):
        return None

    access_token = create_access_token(
        {
            "sub": user.username,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }