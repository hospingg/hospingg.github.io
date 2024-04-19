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
        btnVisible:0
    },
    mounted:function(){
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
        }
    }
});