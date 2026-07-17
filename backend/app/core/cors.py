from fastapi.middleware.cors import CORSMiddleware


def configure_cors(app):
    """
    Configure Cross-Origin Resource Sharing (CORS)
    for frontend applications.
    """

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )