
import React, { useEffect } from 'react';

const Testimonial = () => {
  useEffect(() => {
    const $ = window.$;
    let testimonialCarousel;

    // Pequeño retraso para asegurar que el DOM de React esté listo
    const timer = setTimeout(() => {
      testimonialCarousel = $(".testimonial-carousel");
      if (testimonialCarousel.length > 0 && $.fn.owlCarousel) {
        testimonialCarousel.owlCarousel({
          autoplay: true,
          smartSpeed: 1500,
          dots: true,
          loop: true,
          items: 1
        });
      }
    }, 100);

    // Limpieza al salir de la página para evitar errores de memoria
    return () => {
      clearTimeout(timer);
      if (testimonialCarousel && testimonialCarousel.length > 0 && $.fn.owlCarousel) {
        testimonialCarousel.trigger('destroy.owl.carousel');
      }
    };
  }, []);

  const testimonials = [
    { id: 1, img: "/img/testimonial-1.jpg", name: "Client Name", profession: "Profession" },
    { id: 2, img: "/img/testimonial-2.jpg", name: "Client Name", profession: "Profession" },
    { id: 3, img: "/img/testimonial-3.jpg", name: "Client Name", profession: "Profession" },
    { id: 4, img: "/img/testimonial-4.jpg", name: "Client Name", profession: "Profession" },
  ];

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="section-title">
          <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>
            Testimonial
          </h4>
          <h1 className="display-4">Our Clients Say</h1>
        </div>
        
        <div className="owl-carousel testimonial-carousel">
          {testimonials.map((t) => (
            <div className="testimonial-item" key={t.id}>
              <div className="d-flex align-items-center mb-3">
                <img className="img-fluid" src={t.img} alt={t.name} />
                <div className="ml-3">
                  <h4>{t.name}</h4>
                  <i>{t.profession}</i>
                </div>
              </div>
              <p className="m-0">
                Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. 
                Dolor tempor ipsum sanct clita
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;