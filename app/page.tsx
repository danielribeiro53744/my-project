import Hero from '@/components/home/hero';
import FeaturedProducts from '@/components/home/featured-products';
import Categories from '@/components/home/categories';
import Newsletter from '@/components/home/newsletter';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
}