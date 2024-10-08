import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import { fetchImages } from "../services/unsplashAPI";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import ImageModal from "./components/ImageModal/ImageModal";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Loader from "./components/Loader/Loader";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import s from "./App.module.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({});

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchImages(query, page);
        if (!res.results.length) {
          setIsEmpty(true);
          return;
        }
        setPhotos((prev) => [...prev, ...res.results]);
        setShowLoadMore(page < Math.ceil(res.total_results / res.per_page));
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  useEffect(() => {
    if (page > 1) {
      const imageHeight = 200;
      window.scrollBy({
        top: imageHeight * 2,
        behavior: "smooth",
      });
    }
  }, [photos, page]);

  const handleSearchSubmit = (value) => {
    setQuery(value);
    setPage(1);
    setPhotos([]);
    setShowLoadMore(false);
    setIsError(false);
    setIsEmpty(false);
  };

  const handleClick = () => {
    setPage((prev) => prev + 1);
  };

  const handleOpenModal = (modalImage) => {
    setModalImage(modalImage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalImage({});
    setIsModalOpen(false);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />
      {isError && (
        <ErrorMessage message="Something went wrong, please try again later." />
      )}
      {isEmpty && <h1>No more results found. Please try a different query.</h1>}

      {photos.length > 0 && (
        <ImageGallery photos={photos} handleOpenModal={handleOpenModal} />
      )}
      {photos.length > 0 && !isLoading && <LoadMoreBtn onClick={handleClick} />}
      <ImageModal
        modalImage={modalImage}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
      <div className={s.more}>
        {isLoading && <Loader />}
        {showLoadMore && <button onClick={handleClick}>Load More</button>}
      </div>
    </div>
  );
};

export default App;
