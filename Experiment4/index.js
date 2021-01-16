function loadScriptAsync(path, callback) {
    var script = document.createElement("script");
    script.src = path;
    script.type = "text/javascript";
    script.defer = false;
    script.async = false;
    document.head.appendChild(script);
    script.onload = ((event) => {
        console.log('Done loading "' + path + '"');
        callback();
    });
}

function loadScriptsOrdered(paths, current) {
    if (paths.length > current) {
        loadScriptAsync(paths[current], () => {
            loadScriptsOrdered(paths, current + 1);
        });
    }
}

loadScriptsOrdered([
    "./vec.js",
    "./screen.js",
    "./mouse.js",
    "./keyboard.js",
    "./game.js"
], 0);
