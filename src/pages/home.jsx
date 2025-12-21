import React, { useEffect } from 'react';


const Testimonials = () => {
  // Datos de los testimonios para mantener el código limpio y fácil de editar
  const testimonialData = [
    { id: 1, name: "Client Name", profession: "Profession", img: "/img/testimonial-1.jpg" },
    { id: 2, name: "Client Name", profession: "Profession", img: "/img/testimonial-2.jpg" },
    { id: 3, name: "Client Name", profession: "Profession", img: "/img/testimonial-3.jpg" },
    { id: 4, name: "Client Name", profession: "Profession", img: "/img/testimonial-4.jpg" },
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
        
        {/* Importante: Mantenemos las clases owl-carousel y testimonial-carousel 
            para que el script de jQuery en index.html pueda encontrarlas */}
        <div className="owl-carousel testimonial-carousel">
          {testimonialData.map((item) => (
            <div className="testimonial-item" key={item.id}>
              <div className="d-flex align-items-center mb-3">
                <img 
                  className="img-fluid" 
                  src={item.img} 
                  alt={item.name} 
                  style={{ width: '80px', height: '80px' }} // Ajuste común para owl-carousel
                />
                <div className="ml-3">
                  <h4>{item.name}</h4>
                  <i>{item.profession}</i>
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


const Home = () => {

  useEffect(() => {
    const $ = window.$;
    if (!$) return;

    // Declaramos las variables aquí arriba para que la limpieza (return) las vea
    let mainCarousel;
    let testimonialCarousel;

    // 1. Inicializar Carousel de Bootstrap inmediatamente
    mainCarousel = $('#blog-carousel');
    if (mainCarousel.length > 0) {
      mainCarousel.carousel({
        interval: 5000,
        pause: 'hover'
      });
    }

    // 2. Inicializar Owl Carousel con un pequeño delay
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

    // FUNCIÓN DE LIMPIEZA CORREGIDA
    return () => {
      clearTimeout(timer); // Cancelamos el timer si el usuario se va rápido

      if (mainCarousel && mainCarousel.length > 0) {
        mainCarousel.carousel('dispose');
      }

      // Verificamos que testimonialCarousel exista antes de intentar destruirlo
      if (testimonialCarousel && testimonialCarousel.length > 0 && $.fn.owlCarousel) {
        testimonialCarousel.trigger('destroy.owl.carousel');
      }
    };
  }, []);


  return (
    <>
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div id="blog-carousel" className="carousel slide overlay-bottom" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="/img/carousel-1.jpg" alt="Carousel 1" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <h2 className="text-primary font-weight-medium m-0">The Perfect Cigar</h2>
                <h1 className="display-1 text-white m-0">Tamborilero</h1>
                <h2 className="text-white m-0">* SINCE 1950 *</h2>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="/img/carousel-2.jpg" alt="Carousel 2" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <h2 className="text-primary font-weight-medium m-0">there is no doubt</h2>
                <h1 className="display-1 text-white m-0">The Best Cigar</h1>
                <h2 className="text-white m-0">* SINCE 1950 *</h2>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#blog-carousel" data-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </a>
          <a className="carousel-control-next" href="#blog-carousel" data-slide="next">
            <span className="carousel-control-next-icon"></span>
          </a>
        </div>
      </div>

      {/* About Section (Resumida para el Home) */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="section-title">
            <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>About Us</h4>
            <h1 className="display-4">Smoking Since 1950</h1>
          </div>
          <div className="row">
            <div className="col-lg-4 py-0 py-lg-5">
              <h1 className="mb-3">Our Story</h1>
              <p>Takimata sed vero vero no sit sed, justo clita duo no duo amet et...</p>
              <button className="btn btn-secondary font-weight-bold py-2 px-4 mt-2">Learn More</button>
            </div>
            <div className="col-lg-4 py-5 py-lg-0" style={{ minHeight: '500px' }}>
              <div className="position-relative h-100">
                <img className="position-absolute w-100 h-100" src="/img/about.png" style={{ objectFit: 'cover' }} alt="About" />
              </div>
            </div>
            <div className="col-lg-4 py-0 py-lg-5">
              <h1 className="mb-3">Our Vision</h1>
              <p>Invidunt lorem justo sanctus clita...</p>
              <button className="btn btn-primary font-weight-bold py-2 px-4 mt-2">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Services/Blends Start */}
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="section-title">
            <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>A Little Bit of Our Own</h4>
            <h1 className="display-4">Blends</h1>
          </div>
          <div className="row">
            {[1, 2, 3, 4].map((num) => (
              <div className="col-lg-6 mb-5" key={num}>
                <div className="row align-items-center">
                  <div className="col-sm-5">
                    <img className="img-fluid mb-3 mb-sm-0" src={`/img/service-${num}.jpg`} alt="" />
                  </div>
                  <div className="col-sm-7">
                    <h4>
                      <i><img src="/img/icono.png" width="47" height="33" alt="Icon" /></i>
                      {num === 1 ? 'Tripa Broad Leaf' : 'Capote Criollo 98'}
                    </h4>
                    <p className="m-0">Contribution Dark Sweetness. Full Body. Dense Smoke.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Offer Section */}
      <div className="offer container-fluid my-5 py-5 text-center position-relative overlay-top overlay-bottom">
        <div className="container py-5">
          <h1 className="display-3 text-primary mt-3">100% Quality</h1>
          <h1 className="text-white mb-3">Always the Best</h1>
          <form className="form-inline justify-content-center mb-4">
            <div className="input-group">
              <input type="text" className="form-control p-4" placeholder="Your Email" style={{ height: '60px' }} />
              <div className="input-group-append">
                <button className="btn btn-primary font-weight-bold px-4" type="submit">Sign Up</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Menu/Pricing Start */}
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="section-title">
            <h4 className="text-primary text-uppercase" style={{ letterSpacing: '5px' }}>Menu & Pricing</h4>
            <h1 className="display-4">Competitive Pricing</h1>
          </div>
          <div className="row">
            {/* Columna Sweet */}
            <div className="col-lg-6">
              <h1 className="mb-5">Sweet</h1>
              <div className="row align-items-center mb-5">
                <div className="col-4 col-sm-3">
                  <img className="w-100 rounded-circle mb-3 mb-sm-0" src="/img/menu-1.jpg" alt="" />
                  <h5 className="menu-price">$50</h5>
                </div>
                <div className="col-8 col-sm-9">
                  <h4>Black</h4>
                  <p className="m-0">Sit lorem ipsum et diam elitr est dolor sed duo.</p>
                </div>
              </div>
              {/* Repetir para otros items... */}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Start */}
      <div className="container-fluid my-5">
        <div className="container">
          <div className="reservation position-relative overlay-top overlay-bottom">
            <div className="row align-items-center">
              <div className="col-lg-6 my-5 my-lg-0">
                <div className="p-5">
                  <h1 className="display-3 text-primary">100% Quality</h1>
                  <h1 className="text-white">Online</h1>
                  <p className="text-white">Lorem justo clita erat lorem labore ea...</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="text-center p-5" style={{ background: 'rgba(51, 33, 29, .8)' }}>
                  <h1 className="text-white mb-4 mt-5">Book Your Table</h1>
                  <form className="mb-5">
                    <div className="form-group">
                      <input type="text" className="form-control bg-transparent border-primary p-4" placeholder="Name" required />
                    </div>
                    <div className="form-group">
                      <select className="custom-select bg-transparent border-primary px-4" style={{ height: '49px' }}>
                        <option>Person</option>
                        <option value="1">Person 1</option>
                      </select>
                    </div>
                    <button className="btn btn-primary btn-block font-weight-bold py-3" type="submit">Book Now</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Start */}
      <Testimonials/>
    </>
  );
};

export default Home;

