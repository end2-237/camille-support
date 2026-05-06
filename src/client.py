import os
import requests


def get_proxy_settings():
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
    if not proxy:
        return {}
    return {"http": proxy, "https": proxy}


def fetch(url: str, **kwargs) -> requests.Response:
    proxies = get_proxy_settings()
    return requests.get(url, proxies=proxies, **kwargs)
