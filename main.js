var app = new Vue({
    el:".item-page, .product-page",
    data:{
        products:[
            {id:1, name:"Green Cabbage", short_text:"Standard Round", note:"Firm texture, vibrant color, and rich flavor make it a standout choice for culinary use", 
            characteristics:[{
                plant:['Strong growth with ample leaf coverage.',
                'Highly productive with abundant fruit formation.',
                'Early maturing cultivar.'],
                color:['green'],
                cycle:['fall','spring', 'summer'],
                fruit:['Long-lasting freshness on the plant and after harvest.',
                    'Bright green hue with a glossy appearance.',
                    'Average head size: 1.5 - 2 pounds (680 - 907 grams).']
            }]},
            {id:2, name:"Savoy Cabbage", short_text:"Green Crinkled", note:"Robust growth and high yields ensure ample supply for cooking",
            characteristics:[{
                plant:['Strong growth with ample leaf coverage.',
                'Highly productive with abundant fruit formation.',
                'Early maturing cultivar.'],
                color:['green', 'yellow'],
                cycle:['fall']
            }]},
            {id:3, name:"Brussels Cabbage", short_text:"Sprouts Miniature Dense",
            characteristics:[{
                color:['light-green','green'],
                cycle:['fall','spring', 'summer']
            }]},
            {id:4, name:"Red Cabbage", short_text:"Standard Round", note: "Cabbage can last for weeks, providing a reliable staple for extended periods",
            characteristics:[{
                plant:['Extended shelf life both pre and post-harvest.',
                'Striking deep red color, appealing and attractive.',
                'Average head size: 2 - 3 pounds (907 - 1361 grams).'],
                color:['red','viollet'],
                cycle:['fall', 'summer']
            }]},
            {id:5, name:"Napa Cabbage", short_text:"Elongated Savoy", note: "Packed with vitamins, minerals, and antioxidants",
            characteristics:[{
                plant:['Maintains freshness for an extended period on the plant and after harvest.',
                'Distinctive light green color with a slight sheen.',
                'Average head size: 2 - 3 pounds (907 - 1361 grams).'],
                color:['green','white', 'yellow'],
                cycle:['fall','spring']
            }]},
        ],
        product: {},
        cartItems:null,
        addToCartBtnVisible:0,
        contactFields:[]
    },
    mounted:function(){
        this.getProduct();
        this.checkInCart();
        this.getProduct();
    },
    methods:{
        getProduct:function(){
            if(window.location.hash){
                let id = window.location.hash.replace('#','');
                if (this.products && this.products.length>0){
                    for(let i in this.products){
                        if(this.products[i] && this.products[i].id && id==this.products[i].id) 
                        this.product=this.products[i];
                    }
                }
            }
        },
        addToCart:function(id) {
            let cart = [];
            if(window.localStorage.getItem('cart')) {
                cart = window.localStorage.getItem('cart').split(', ');
            }
            if(cart.indexOf(String(id))==-1) {
                cart.push(id);
                window.localStorage.setItem('cart',cart.join(', '));
                this.addToCartBtnVisible=1;
                
            }
        },
        checkInCart:function(){
            if(this.product && this.product.id && window.localStorage.getItem('cart')!=null && window.localStorage.getItem('cart').split(', ').indexOf(String(this.product.id))!=-1) {
                this.addToCartBtnVisible=1}
            if(window.localStorage.getItem('cart')!=null){
                this.cartItems = window.localStorage.getItem('cart').split(', ');
            };
        },
        getProductToCart:function(id) {
            let cart = this.products.find(cart => cart.id == id);
            return cart ? cart : 'Продукт не знайдено';
        },
        removeToCart:function(id) {
            let cart = [];
            if(window.localStorage.getItem('cart')) {
                cart = window.localStorage.getItem('cart').split(', ');
            }
            
            const index = cart.indexOf(String(id));
            if(index !== -1) {
                cart.splice(index, 1); 
            
                window.localStorage.setItem('cart', cart.join(', ')); 

                this.addToCartBtnVisible = 0;
                
                this.cartItems = cart;
                if(cart.length==[]){
                    localStorage.removeItem("cart");
                    this.cartItems=null;
                }
            }
        },
        isFormValid:function() {
            if(this.contactFields.name &&
                this.contactFields.company_name &&
                this.contactFields.position &&
                this.contactFields.city &&
                this.contactFields.country &&
                this.contactFields.telephone &&
                this.contactFields.email &&
                this.contactFields.you_are &&
                this.contactFields.interesting_in &&
                this.contactFields.code){
                return true;
            }
            ;
        },
        makeOrder:function(){
            newContactFields = {
                name: this.contactFields.name,
                company_name: this.contactFields.company_name,
                position: this.contactFields.position,
                city: this.contactFields.city,
                country: this.contactFields.country,
                telephone: this.contactFields.telephone,
                email: this.contactFields.email,
                you_are: this.contactFields.you_are,
                you_are_other: this.contactFields.you_are_other,
                interesting_in: this.contactFields.interesting_in,
                code: this.contactFields.code
            };
            this.contactFields.push(newContactFields);
            
            this.cartItems = [];
            
            localStorage.removeItem("cart");

            let order = document.querySelector(".order");
            let list = document.createElement("ul");

            
            for (let field in newContactFields) {
                if (field !== "code") { 
                    let li = document.createElement("li");
                    let p = document.createElement("p");
                    p.textContent = field.replace(/_/g, " ") + ": " + newContactFields[field]; 
                    li.appendChild(p);
                    list.appendChild(li);
                }
            }

            order.appendChild(list);

            let formElement = document.querySelector('#contact-us .wrapper .row');
            formElement.style.display = 'none';

            let orderElement = document.querySelector('.order');
            orderElement.style.display = '';
            
        }
    }
})
