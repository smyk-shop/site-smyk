const products = [
    { id: 1, name: "", price: 100, img: "" },
    { id: 2, name: "", price: 100, img: "" },
    { id: 3, name: "", price: 100, img: "" },
    { id: 4, name: "", price: 100, img: "" },
    { id: 5, name: "", price: 100, img: "" },
    { id: 6, name: "", price: 100, img: "" },
    { id: 7, name: "", price: 100, img: "" },
    { id: 8, name: "", price: 100, img: "" },
    { id: 9, name: "", price: 100, img: "" },
    { id: 10, name: "", price: 100, img: "" },
    { id: 11, name: "", price: 100, img: "" },
    { id: 12, name: "", price: 100, img: "" },
    { id: 13, name: "", price: 100, img: "" },
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
