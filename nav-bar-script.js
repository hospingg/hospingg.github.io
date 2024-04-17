let button = document.getElementById('burger-bar');
let logo = document.getElementsByClassName('logo')[0];
let search = document.getElementsByClassName('search')[0];
let navigation = document.getElementsByClassName('nav-bar')[0];
let list = document.querySelector('.nav-bar ul');
let header = document.getElementsByTagName('header')[0];
let elementsWithDisplayNone = document.querySelectorAll('.product-list, .content, .profile-management-products-social-media, #slider, .bg, #contact-us, .our-adress, .product-page, .item-page');
let whiteHeader = document.getElementById('white-header');

document.getElementById('burger-bar').addEventListener('click', function() {
    
    if (button.classList.contains('deactivated')) {
        button.classList.remove('deactivated');
        button.classList.add('activated');
        
        logo.classList.add('hide-element');
        search.classList.add('hide-element');
        

        list.classList.add('show-list');
        navigation.classList.add('full-menu');
        header.classList.add('full-menu-header');

    } else {
        button.classList.remove('activated');
        button.classList.add('deactivated');

        logo.classList.remove('hide-element');
        search.classList.remove('hide-element');

        list.classList.remove('show-list');
        navigation.classList.remove('full-menu');
        header.classList.remove('full-menu-header');

        
    }
    
    
    elementsWithDisplayNone.forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
    if (whiteHeader) {
        if (whiteHeader.style.boxShadow === 'none') {
            whiteHeader.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 10px 20px;';
        } else {
            whiteHeader.style.boxShadow = 'none';
        }}
});

let mediaQuery = window.matchMedia('(min-width: 932px)');

function handleScreenSizeChange(event) {
    if (event.matches) {
        button.classList.remove('activated');
        button.classList.add('deactivated');

        logo.classList.remove('hide-element');
        search.classList.remove('hide-element');

        list.classList.remove('show-list');
        navigation.classList.remove('full-menu');
        header.classList.remove('full-menu-header');

        if (whiteHeader) {
            whiteHeader.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 10px 20px;';
        }

        elementsWithDisplayNone.forEach(function(element) {
            element.style.display = '';})
    }
}

mediaQuery.addListener(handleScreenSizeChange);

handleScreenSizeChange(mediaQuery);