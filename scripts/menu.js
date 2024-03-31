document.addEventListener("DOMContentLoaded", function () {
  // Crear elementos HTML x DOM con los menuItems
  function createMenuItem(item) {
      const menuItemContainer = document.createElement('div');
      menuItemContainer.classList.add('menu-item');

      const image = document.createElement('img');
      image.src = item.imageSrc;
      image.alt = item.name;

      const itemName = document.createElement('h3');
      itemName.textContent = item.name;

      const itemDescription = document.createElement('p');
      itemDescription.textContent = item.ingredients;

      menuItemContainer.appendChild(image);
      menuItemContainer.appendChild(itemName);
      menuItemContainer.appendChild(itemDescription);

      menuItemContainer.id = 'margin2';

      return menuItemContainer;
  }

  function renderMenuItems(category, data) {
      const categoryContainer = document.getElementById(category);

      data.forEach(item => {
          const menuItem = createMenuItem(item);
          categoryContainer.appendChild(menuItem);
      });
  }

  // Fetch info del menu desde JSON por categoria de comida
  fetch('../JSON/menuItems.json')
      .then(response => response.json())
      .then(data => {
          renderMenuItems('Anti-pasti', data.filter(item => item.category === 'Anti Pasti'));
          renderMenuItems('Pasta', data.filter(item => item.category === 'Pasta'));
          renderMenuItems('Sauce', data.filter(item => item.category === 'Sauce'));
          renderMenuItems('Cold-drink', data.filter(item => item.category === 'Cold Drink'));
          renderMenuItems('Dessert', data.filter(item => item.category === 'Dessert'));
          renderMenuItems('Hot-drink', data.filter(item => item.category === 'Hot Drink'));
      })
      .catch(error => {
          console.error('Error fetching menu data:', error);
      });
});
