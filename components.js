export const createProductCard = (product) => {
    return `
        <div class="product-card group" data-id="${product.id}">
            <div class="product-image-container relative">
                <img src="${product.image}" alt="${product.name}">
                <button onclick="addToCart(${product.id}, true)" class="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-[#3D2B1F] p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all font-bold text-xs uppercase tracking-wider">
                    Quick Buy
                </button>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-['Montserrat'] font-bold text-lg leading-tight">${product.name}</h3>
                    <span class="text-[#C68E17] font-bold text-nowrap ml-2">₹${product.price}</span>
                </div>
                <p class="text-[#3D2B1F]/60 text-sm mb-6 line-clamp-2 h-10">${product.description}</p>
                <button onclick="addToCart(${product.id})" class="w-full flex items-center justify-center gap-2 border-2 border-[#F4C2C2] text-[#3D2B1F] py-3 rounded-xl font-bold hover:bg-[#F4C2C2] transition-all group-hover:shadow-md">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    Add to Basket
                </button>
            </div>
        </div>
    `;
};

export const createReviewCard = (review) => {
    let stars = '';
    for(let i=0; i<5; i++) {
        stars += `<i data-lucide="star" class="w-4 h-4 ${i < review.stars ? 'fill-[#C68E17] text-[#C68E17]' : 'text-gray-300'}"></i>`;
    }
    
    return `
        <div class="review-card hover:border-[#F4C2C2] transition-colors">
            <div class="flex mb-4">${stars}</div>
            <p class="italic text-[#3D2B1F]/80 mb-6 min-h-[60px]">"${review.text}"</p>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#F4C2C2] rounded-full flex items-center justify-center font-bold text-sm text-[#3D2B1F]">
                    ${review.name.charAt(0)}
                </div>
                <span class="font-bold text-sm">${review.name}</span>
            </div>
        </div>
    `;
};
