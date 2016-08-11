var pattern = Trianglify({
    width: window.innerWidth,
    height: $('.header').outerHeight(),
    cell_size: 50,
    variance: 1,
    stroke_width: 6,
    x_colors: ['#000000', '#333333', '#999999'],
    y_colors: ['#000000', '#333333', '#999999']
}).canvas();

$('.header').append(pattern);