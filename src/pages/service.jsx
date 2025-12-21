


import React from 'react';

// Sub-componente para cada bloque de servicio
const ServiceItem = ({ img, title, description }) => (
  <div className="col-lg-6 mb-5">
    <div className="row align-items-center">
      <div className="col-sm-5">
        <img className="img-fluid mb-3 mb-sm-0" src={img} alt={title} />
      </div>
      <div className="col-sm-7">
        <h4>
          <i className="">
            <img src="/img/icono.png" width="47" height="33" alt="Icono" />
          </i> 
          {" "}{title}
        </h4>
        <p className="m-0">{description}</p>
      </div>
    </div>
  </div>
);

const Service = () => {
  const servicesData = [
    {
      id: 1,
      img: "/img/service-1.jpg",
      title: "Delivery",
      description: "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor"
    },
    {
      id: 2,
      img: "/img/service-2.jpg",
      title: "Fresh",
      description: "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor"
    },
    {
      id: 3,
      img: "/img/service-3.jpg",
      title: "Best Quality",
      description: "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor"
    },
    {
      id: 4,
      img: "/img/service-4.jpg",
      title: "Online",
      description: "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor"
    }
  ];

  return (
    <div className="container-fluid pt-5">
      <div className="container">
        <div className="section-title">
          <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>
            Our Services
          </h4>
          <h1 className="display-4">Fresh</h1>
        </div>
        <div className="row">
          {servicesData.map((service) => (
            <ServiceItem 
              key={service.id}
              img={service.img}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;