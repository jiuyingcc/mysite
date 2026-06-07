const getUrlParams = name => {
    let url = window.location.href;
    url = new URL(url);
    return url.searchParams.get(name);
}