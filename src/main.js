
var theme = document.getElementsByTagName('link')[0];

function toggleTheme(theme) {
    
    if (theme.getAttribute('href') == 'style.css') {
        theme.setAttribute('href', 'style.css');
    } else {
        theme.setAttribute('href', 'styleD.css');
    }
}