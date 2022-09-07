import type { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "../styles/Home.module.css";
import { Loader } from "semantic-ui-react";

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexPageProps {
  initialCatImageUrl: string;
}

const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  // console.log(result[0]);
  return result[0];
};

const Home: NextPage<IndexPageProps> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    setCatImageUrl(catImage.url);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>猫画像アプリ</h1>
      {isLoading ? (
        <Loader active size="small" inline="centered" />
      ) : (
        <img className={styles.img} src={catImageUrl} />
      )}

      <button className={styles.btn} onClick={handleClick}>
        今日の猫さん
      </button>
    </div>
  );
};

// SSR(サーバーサイドレンダリング)
export const getServerSideProps: GetServerSideProps<
  IndexPageProps
> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default Home;
