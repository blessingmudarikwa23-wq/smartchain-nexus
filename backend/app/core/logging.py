import logging
import os
from logging.handlers import RotatingFileHandler

# ===========================
# Create logs directory
# ===========================
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "smartchain.log")

# ===========================
# Log format
# ===========================
LOG_FORMAT = (
    "%(asctime)s | %(levelname)s | %(name)s | "
    "%(filename)s:%(lineno)d | %(message)s"
)

formatter = logging.Formatter(LOG_FORMAT)

# ===========================
# Rotating File Handler
# ===========================
file_handler = RotatingFileHandler(
    LOG_FILE,
    maxBytes=5 * 1024 * 1024,  # 5 MB
    backupCount=5,
    encoding="utf-8",
)

file_handler.setFormatter(formatter)
file_handler.setLevel(logging.INFO)

# ===========================
# Console Handler
# ===========================
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
console_handler.setLevel(logging.INFO)

# ===========================
# Root Logger
# ===========================
logger = logging.getLogger("smartchain")

if not logger.handlers:
    logger.setLevel(logging.INFO)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

logger.propagate = False