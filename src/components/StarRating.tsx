import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export function StarRating({ rating }: { rating: number }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-primary" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-primary" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-primary" />);
    }
  }

  return <div className="flex">{stars}</div>;
}
