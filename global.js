function loadHtmlIntoId(id, file, callback) {
    //perfect, this works well. copy pasted from stack exchange. hell yeah.
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want
        document.getElementById(id).innerHTML = this.responseText;
        callback();
    };
    xhr.send();
}