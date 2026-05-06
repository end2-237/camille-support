import os
import pytest
import requests
from unittest.mock import patch, MagicMock
from src.client import fetch, get_proxy_settings


def test_get_proxy_settings_with_env(monkeypatch):
    monkeypatch.setenv("HTTPS_PROXY", "http://proxy.example.com:8080")
    settings = get_proxy_settings()
    assert settings == {
        "http": "http://proxy.example.com:8080",
        "https": "http://proxy.example.com:8080",
    }


def test_get_proxy_settings_empty(monkeypatch):
    monkeypatch.delenv("HTTPS_PROXY", raising=False)
    monkeypatch.delenv("HTTP_PROXY", raising=False)
    settings = get_proxy_settings()
    assert settings == {}


def test_fetch_uses_proxy(monkeypatch):
    """fetch() must forward requests through the configured proxy."""
    monkeypatch.setenv("HTTPS_PROXY", "http://proxy.example.com:8080")

    mock_response = MagicMock()
    mock_response.status_code = 200

    with patch("src.client.requests.get", return_value=mock_response) as mock_get:
        fetch("https://example.com")

    call_kwargs = mock_get.call_args
    proxies = call_kwargs.kwargs.get("proxies") or call_kwargs.args[1] if len(call_kwargs.args) > 1 else {}
    assert proxies.get("https") == "http://proxy.example.com:8080", (
        "Request must be routed through the proxy — direct connections are refused."
    )


def test_fetch_without_proxy_env_sends_no_proxy(monkeypatch):
    """Without proxy env vars, proxies dict is empty (no bypass attempted)."""
    monkeypatch.delenv("HTTPS_PROXY", raising=False)
    monkeypatch.delenv("HTTP_PROXY", raising=False)

    mock_response = MagicMock()
    mock_response.status_code = 200

    with patch("src.client.requests.get", return_value=mock_response) as mock_get:
        fetch("https://example.com")

    call_kwargs = mock_get.call_args
    proxies = call_kwargs.kwargs.get("proxies", {})
    assert proxies == {}
