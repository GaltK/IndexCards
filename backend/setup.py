"""
Setup configuration for IndexCards backend
"""
from setuptools import setup, find_packages

setup(
    name="indexcards-backend",
    version="1.0.0",
    description="Backend Lambda functions for IndexCards platform",
    packages=find_packages(exclude=["test", "test.*"]),
    python_requires=">=3.11",
    install_requires=[
        "boto3>=1.28.0",
        "pymysql>=1.1.0",
        "cryptography>=41.0.0",
        "python-jose[cryptography]>=3.3.0",
        "pydantic>=2.4.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-cov>=4.1.0",
            "pytest-mock>=3.11.0",
            "hypothesis>=6.88.0",
            "moto>=4.2.0",
            "black>=23.9.0",
            "flake8>=6.1.0",
            "mypy>=1.5.0",
        ],
    },
)
