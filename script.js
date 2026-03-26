const products = [
    { id: 1, name: "Смартфон Blue X", price: 59900, img: "https://via.placeholder.com" },
    { id: 2, name: "Наушники AirWave", price: 12500, img: "https://via.placeholder.com" },
    { id: 3, name: "Часы SkyWatch", price: 21000, img: "https://via.placeholder.com" },
    { id: 4, name: "Ноутбук Frost", price: 89000, img: "https://via.placeholder.com" },
];

const grid = document.getElementById('product-grid');
let cartCount = 0;

products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">${p.price.toLocaleString()} ₽</p>
        <button class="btn-add" onclick="addToCart()">В корзину</button>
    `;
    grid.appendChild(card);
});

function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    alert('Товар добавлен в корзину!');
}
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
