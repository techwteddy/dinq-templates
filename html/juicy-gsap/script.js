
var tl = gsap.timeline({scrollTrigger:{
    trigger:".tow",
    start:"0% 95%",
    end:"80% 60%,",
    scrub:true
}})

tl.to("#cans",{
    top:"145%",
    left:"77%",
    width:"30%",
    rotate:"-30deg"
},'cans')

tl.to('#left',{
    top:'153%',
    rotate:'0deg',
    with:'12%',
    left:'75%'
},'cans')

tl.to('#blackberry1',{
    top:'114%',
    width:'5%',
    left:'5%',
    rotate:'100deg'
},'cans')
tl.to('#blackberry2',{
    top:'125%',
    width:'12%',
    left:'83%',
    rotate:'100deg'
},'cans')
tl.to('#blackberry3',{
    top:'163%',
    width:'5%',
    left:'70%',
    rotate:'60deg'
},'cans')

var tl2 = gsap.timeline({scrollTrigger:{
    trigger:'.three',
    start:'0% 95%',
    end:'20% 50%',
    scrub:true
}})
tl2.to('#cans',{
    top:"240%",
    left:"50%",
    width:"30%",
    rotate:"0deg"
},'cans')