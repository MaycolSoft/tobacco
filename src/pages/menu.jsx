import React from 'react';

// Sub-componente para no repetir HTML (DRY - Don't Repeat Yourself)
const MenuItem = ({ img, price, title, description }) => (
  <div className="row align-items-center mb-5">
    <div className="col-4 col-sm-3">
      <img className="w-100 rounded-circle mb-3 mb-sm-0" src={img} alt={title} />
      <h5 className="menu-price">{price}</h5>
    </div>
    <div className="col-8 col-sm-9">
      <h4>{title}</h4>
      <p className="m-0">{description}</p>
    </div>
  </div>
);

const Menu = () => {
  const sweetCigars = [
    { id: 1, img: "/img/menu-1.jpg", price: "$60", title: "Black", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
    { id: 2, img: "/img/menu-2.jpg", price: "$60", title: "Cacao", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
    { id: 3, img: "/img/menu-3.jpg", price: "$60", title: "Coffee", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
  ];

  const strongCigars = [
    { id: 4, img: "/img/menu-1.jpg", price: "$50", title: "Strong", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
    { id: 5, img: "/img/menu-2.jpg", price: "$45", title: "Cacao", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
    { id: 6, img: "/img/menu-3.jpg", price: "$80", title: "Coffee", description: "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor" },
  ];

  return (
    <div className="container-fluid pt-5">
      <div className="container">
        <div className="section-title">
          <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>
            Pricing
          </h4>
          <h1 className="display-4">Pricing</h1>
        </div>
        <div className="row">
          {/* Columna Sweet */}
          <div className="col-lg-6">
            <h1 className="mb-5">Sweet</h1>
            {sweetCigars.map(cigar => (
              <MenuItem key={cigar.id} {...cigar} />
            ))}
          </div>

          {/* Columna Strong */}
          <div className="col-lg-6">
            <h1 className="mb-5">Strong</h1>
            {strongCigars.map(cigar => (
              <MenuItem key={cigar.id} {...cigar} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;