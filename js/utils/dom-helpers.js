export class DOMHelpers {
  static createCategoryCard(category) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'scale-75', 'rotate-12'
    );
    
    cardDiv.innerHTML = `
      <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-3 rounded-2xl overflow-hidden bg-white cursor-pointer border border-gray-100">
        <div class="overflow-hidden">
          <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:brightness-110" 
               src="${category.imageUrl}" alt="${category.name}"/>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <p class="font-righteous text-sm text-gray-500">Categoría</p>
            <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
          <h4 class="font-gaegu text-lg font-bold tracking-wide text-gray-800">${category.name}</h4>
        </div>
      </div>
    `;
    
    return cardDiv;
  }

  static createProductCard(product) {
    const productElement = document.createElement('div');
    productElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    
    productElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${product.imageUrl}" 
             alt="${product.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${product.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${product.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    
    return productElement;
  }

  static createTestimonyCard(testimony) {
    const testimonyElement = document.createElement('div');
    testimonyElement.classList.add(
      'w-full', 'md:w-1/2', 'xl:w-1/3', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', '-translate-x-full', 'rotate-y-90'
    );
    
    testimonyElement.innerHTML = `
      <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-rotate-1 rounded-2xl overflow-hidden bg-white cursor-pointer border border-gray-100">
        <div class="overflow-hidden">
          <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:sepia" 
               src="${testimony.imageUrl}" 
               alt="${testimony.title}"/>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <p class="font-righteous text-sm text-gray-500">Testimonio</p>
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
          <h4 class="font-gaegu text-lg font-bold tracking-wide text-gray-800 mb-3">${testimony.title}</h4>
          <p class="font-righteous text-sm text-gray-600 text-justify leading-relaxed">${testimony.description}</p>
        </div>
      </div>
    `;
    
    return testimonyElement;
  }
}