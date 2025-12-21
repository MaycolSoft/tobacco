// src/components/common/BackToTop.jsx
import { useEffect, useState } from 'react';

const BackToTop = () => {
  // Aquí podrías añadir lógica para que solo aparezca al hacer scroll
  return (
    <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
      <i className="fa fa-angle-double-up"></i>
    </a>
  );
};

export default BackToTop;