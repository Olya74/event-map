import "./loading.css";

function Loader() {
  return (
    <div className="loader__wrapper">
    <div className="loader__ring"></div>
    <div className="loader__ring"></div>
    <div className="loader__core"></div>
    <div className="loader__text">Загрузка...</div>
  </div>
  );
}

export default Loader;
