import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Youtube,
} from "lucide-react";
import { API, money, useStore } from "./store.jsx";

const fallbackProducts = [
  {
    id: 1,
    slug: "godha-garam-masala",
    name: "Godha Garam Masala",
    category: "Blended Masala",
    short_description: "A warming Maharashtrian blend for everyday comfort.",
    description:
      "Aromatic, deeply warming and made for the meals that bring everyone to the table.",
    price: 149,
    compare_at_price: 179,
    image_url:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85",
    pack_size: "100 g",
    rating: 4.9,
    review_count: 128,
    is_featured: 1,
  },
  {
    id: 2,
    slug: "kolhapuri-masala",
    name: "Kolhapuri Masala",
    category: "Regional Special",
    short_description: "Bold heat and unmistakable Kolhapuri character.",
    description: "A robust regional blend for misal and hearty curries.",
    price: 169,
    compare_at_price: 199,
    image_url:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85",
    pack_size: "100 g",
    rating: 4.8,
    review_count: 94,
    is_featured: 1,
  },
  {
    id: 3,
    slug: "kanda-lasun-masala",
    name: "Kanda Lasun Masala",
    category: "Blended Masala",
    short_description: "The savoury backbone of a Maharashtrian kitchen.",
    description: "A rich, savoury blend for bhaji, amti and everyday meals.",
    price: 159,
    compare_at_price: 189,
    image_url:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f8?auto=format&fit=crop&w=1000&q=85",
    pack_size: "100 g",
    rating: 4.9,
    review_count: 103,
    is_featured: 1,
  },
  {
    id: 4,
    slug: "misal-masala",
    name: "Misal Masala",
    category: "Regional Special",
    short_description: "Street-food energy for homemade misal.",
    description:
      "Bring the lively flavour of a favourite Maharashtrian snack to your kitchen.",
    price: 139,
    compare_at_price: 169,
    image_url:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85",
    pack_size: "100 g",
    rating: 4.7,
    review_count: 76,
    is_featured: 1,
  },
];
const imageFor = (p) =>
  p.image_url?.includes("photo- spices")
    ? fallbackProducts[0].image_url
    : p.image_url;
function useProducts() {
  const [products, setProducts] = useState(fallbackProducts),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (d.products?.length) setProducts(d.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { products, loading };
}
function Header() {
  const { count } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="announcement">
        <span>
          <Sparkles size={13} /> A little more love in every spoon
        </span>
        <span className="announcement-mid">
          FREE DELIVERY ON ORDERS ABOVE ₹799
        </span>
        <span className="announcement-right">Made with care in India</span>
      </div>
      <header className="site-header">
        <button
          className="icon-button mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/" className="brand">
          <span className="brand-mark">ss</span>
          <span>
            <strong>Swaad Sutra</strong>
            <small>THE ART OF INDIAN FLAVOUR</small>
          </span>
        </Link>
        <nav className={open ? "main-nav open" : "main-nav"}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" onClick={() => setOpen(false)}>
            Shop all
          </NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>
            Our story
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
        </nav>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            location.href = `/shop?q=${encodeURIComponent(search)}`;
          }}
        >
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find your flavour"
          />
          <button aria-label="Search">
            <ArrowRight size={15} />
          </button>
        </form>
        <Link to="/cart" className="bag-link" aria-label="Shopping bag">
          <ShoppingBag size={20} />
          <span>Bag</span>
          <b>{count}</b>
        </Link>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand brand-light">
            <span className="brand-mark">ss</span>
            <span>
              <strong>Swaad Sutra</strong>
              <small>THE ART OF INDIAN FLAVOUR</small>
            </span>
          </Link>
          <p>
            Rooted in tradition. Blended for today.
            <br />A little more soul in every meal.
          </p>
          <div className="socials">
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              <Youtube />
            </a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/shop">Shop all masalas</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <div>
          <h4>Customer care</h4>
          <Link to="/contact">FAQs & support</Link>
          <a href="mailto:hello@swaadsutra.example">Email us</a>
          <span>Mon–Sat · 9 AM–6 PM</span>
        </div>
        <div className="newsletter">
          <h4>Letters from our kitchen</h4>
          <p>Recipes, rituals and a little spice in your inbox.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "Thanks for your interest! Newsletter service can be connected before launch.",
              );
            }}
          >
            <input type="email" required placeholder="Your email address" />
            <button aria-label="Subscribe">
              <ArrowRight />
            </button>
          </form>
          <small>By subscribing, you agree to receive brand updates.</small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Swaad Sutra. All rights reserved.
        </span>
        <span>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#shipping">Shipping & returns</a>
        </span>
        <span>
          Made for the love of good food <Heart size={13} fill="currentColor" />
        </span>
      </div>
    </footer>
  );
}
function ProductCard({ product, index = 0 }) {
  const { addToCart } = useStore();
  return (
    <article className="product-card" style={{ "--delay": `${index * 55}ms` }}>
      <Link to={`/product/${product.slug}`} className="product-image">
        <img src={imageFor(product)} alt={product.name} loading="lazy" />
        <span className="product-tag">
          {product.is_featured ? "BESTSELLER" : product.category}
        </span>
        <button
          className="quick-add"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus />
        </button>
      </Link>
      <div className="product-card-info">
        <div className="rating">
          <Star size={13} fill="currentColor" />
          <span>{Number(product.rating || 4.8).toFixed(1)}</span>
          <small>({product.review_count || 0})</small>
        </div>
        <Link to={`/product/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <p>{product.short_description}</p>
        <div className="product-price">
          <strong>{money(product.price)}</strong>
          {product.compare_at_price && (
            <del>{money(product.compare_at_price)}</del>
          )}
          <span>{product.pack_size}</span>
        </div>
      </div>
    </article>
  );
}
function SectionTitle({ eyebrow, title, body, link, to = "/shop" }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
      {link && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}
function Home() {
  const { products } = useProducts();
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span></span> A HERITAGE OF FLAVOUR
          </div>
          <h1>
            Every meal has
            <br />a <em>story.</em> Make it
            <br />
            delicious.
          </h1>
          <p>
            Thoughtfully blended masalas inspired by the kitchens, memories and
            generous hearts of India.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/shop">
              Shop our masalas <ArrowRight size={17} />
            </Link>
            <Link className="underlined-link" to="/about">
              Discover our story <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <span>✦</span>
              <span>✿</span>
              <span>❋</span>
            </div>
            <div>
              <strong>Made for real kitchens</strong>
              <small>Everyday flavour, made memorable</small>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1400&q=90"
              alt="Colourful spices and ingredients"
            />
          </div>
          <div className="hero-stamp">
            <span>ROOTED IN</span>
            <strong>tradition</strong>
            <span>BLENDED WITH LOVE</span>
            <i>✳</i>
          </div>
          <div className="hero-caption">
            <span>01 / 04</span>
            <span>THE FLAVOUR COLLECTION</span>
          </div>
        </div>
        <div className="hero-side-note">A PINCH OF HOME, WHEREVER YOU ARE</div>
      </section>
      <div className="trust-strip">
        <div>
          <Leaf />
          <span>
            <strong>Thoughtfully sourced</strong>
            <small>Ingredients that matter</small>
          </span>
        </div>
        <div>
          <Sparkles />
          <span>
            <strong>Small-batch spirit</strong>
            <small>Care in every blend</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <strong>Honest ingredients</strong>
            <small>Flavour first, always</small>
          </span>
        </div>
        <div>
          <Truck />
          <span>
            <strong>Delivered with care</strong>
            <small>From our kitchen to yours</small>
          </span>
        </div>
      </div>
      <section className="section container">
        <SectionTitle
          eyebrow="THE HOUSE FAVOURITES"
          title="A little magic. A lot of flavour."
          body="The blends our kitchens come back to, again and again."
          link="Shop all masalas"
        />
        <div className="product-grid">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
      <section className="story-banner">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=85"
            alt="A warm home kitchen"
          />
        </div>
        <div className="story-copy">
          <span className="eyebrow">A STORY IN EVERY SPOON</span>
          <h2>
            Some recipes are
            <br />
            measured in <em>memories.</em>
          </h2>
          <p>
            The sound of mustard seeds in hot oil. The aroma that brings
            everyone to the kitchen. The recipe your grandmother never wrote
            down. That is where our story begins.
          </p>
          <Link className="btn btn-outline" to="/about">
            Meet Swaad Sutra <ArrowRight size={16} />
          </Link>
          <span className="story-flower">✳</span>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          eyebrow="FIND YOUR FLAVOUR"
          title="What are we cooking today?"
          body="From everyday essentials to regional favourites, find the blend that feels like home."
        />
        <div className="category-grid">
          <Link
            to="/shop?category=Blended%20Masala"
            className="category-tile cat-one"
          >
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85"
              alt="Blended spices"
            />
            <span>01</span>
            <div>
              <small>THE EVERYDAY HEROES</small>
              <h3>Blended masalas</h3>
              <b>
                Explore collection <ArrowRight />
              </b>
            </div>
          </Link>
          <Link
            to="/shop?category=Regional%20Special"
            className="category-tile cat-two"
          >
            <img
              src="https://images.unsplash.com/photo-1615485500704-8e990f9900f8?auto=format&fit=crop&w=800&q=85"
              alt="Regional spices"
            />
            <span>02</span>
            <div>
              <small>ROOTED IN PLACE</small>
              <h3>Regional favourites</h3>
              <b>
                Explore collection <ArrowRight />
              </b>
            </div>
          </Link>
          <Link
            to="/shop?category=Everyday%20Essentials"
            className="category-tile cat-three"
          >
            <img
              src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=85"
              alt="Everyday cooking"
            />
            <span>03</span>
            <div>
              <small>THE PANTRY STAPLES</small>
              <h3>Everyday essentials</h3>
              <b>
                Explore collection <ArrowRight />
              </b>
            </div>
          </Link>
        </div>
      </section>
      <section className="quote-band">
        <span>✳</span>
        <blockquote>
          “The secret ingredient is always the love you put into it.”
        </blockquote>
        <small>— THE SWAAD SUTRA KITCHEN</small>
      </section>
      <section className="section container">
        <div className="newsletter-panel">
          <div>
            <span className="eyebrow">A LITTLE NOTE FROM US</span>
            <h2>Good food brings us together.</h2>
            <p>
              Follow the aroma, collect recipes and bring a little more joy to
              your everyday cooking.
            </p>
          </div>
          <Link to="/shop" className="btn btn-dark">
            Find your next favourite <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
function Shop() {
  const { products } = useProducts();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("popular");
  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        `${p.name} ${p.category} ${p.short_description}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "rating"
            ? b.rating - a.rating
            : Number(b.is_featured) - Number(a.is_featured),
    );
  const categories = [
    "All",
    "Blended Masala",
    "Regional Special",
    "Everyday Essentials",
  ];
  return (
    <main>
      <div className="page-hero shop-hero">
        <span className="eyebrow">THE SWAAD SUTRA PANTRY</span>
        <h1>
          Find your <em>flavour.</em>
        </h1>
        <p>Good ingredients. Thoughtful blends. Unforgettable meals.</p>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          Shop all
        </div>
      </div>
      <section className="section container shop-section">
        <div className="shop-toolbar">
          <div className="filter-pills">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => {
                  setCategory(c);
                  setParams(c === "All" ? {} : { category: c });
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="shop-sort">
            <span>{filtered.length} blends</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="popular">Sort: Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
        <div className="shop-search">
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search masalas, flavours, ingredients…"
          />
          {q && (
            <button onClick={() => setQ("")}>
              <X />
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="product-grid shop-grid">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Sparkles />
            <h3>No blends found just yet</h3>
            <p>Try a different search or explore all our flavours.</p>
            <button
              className="btn btn-dark"
              onClick={() => {
                setQ("");
                setCategory("All");
              }}
            >
              View all products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
function ProductDetail() {
  const { slug } = useParams();
  const { products } = useProducts();
  const product =
    products.find((p) => p.slug === slug) ||
    fallbackProducts.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useStore();
  if (!product)
    return (
      <main className="section container">
        <h2>Finding your flavour…</h2>
        <p>If the product doesn't appear, return to the shop.</p>
        <Link className="btn btn-dark" to="/shop">
          Browse products
        </Link>
      </main>
    );
  return (
    <main className="container detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop">Shop</Link>
        <ChevronRight size={13} />
        {product.name}
      </div>
      <div className="detail-layout">
        <div className="detail-image">
          <img src={imageFor(product)} alt={product.name} />
          <span className="detail-image-note">
            A LITTLE MAGIC IN EVERY SPOON
          </span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="rating detail-rating">
            <Star fill="currentColor" />
            <strong>{Number(product.rating || 4.8).toFixed(1)}</strong>
            <span>({product.review_count || 0} kitchen notes)</span>
          </div>
          <p className="detail-intro">{product.short_description}</p>
          <div className="detail-price">
            <strong>{money(product.price)}</strong>
            {product.compare_at_price && (
              <del>{money(product.compare_at_price)}</del>
            )}
            <span>Inclusive of applicable taxes</span>
          </div>
          <div className="pack-row">
            <span>PACK SIZE</span>
            <b>{product.pack_size || "100 g"}</b>
          </div>
          <div className="qty-add">
            <div className="qty-control">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
              >
                <Minus />
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty(Math.min(20, qty + 1))}
                aria-label="Increase quantity"
              >
                <Plus />
              </button>
            </div>
            <button
              className="btn btn-dark add-detail"
              onClick={() => {
                addToCart(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? (
                <>
                  <Check /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag /> Add to bag · {money(product.price * qty)}
                </>
              )}
            </button>
          </div>
          <div className="detail-benefits">
            <div>
              <Truck />
              <span>
                <b>Carefully packed</b>
                <small>Prepared for your pantry</small>
              </span>
            </div>
            <div>
              <ShieldCheck />
              <span>
                <b>Secure checkout</b>
                <small>Safe payment options</small>
              </span>
            </div>
            <div>
              <Leaf />
              <span>
                <b>Kitchen inspired</b>
                <small>Made for everyday meals</small>
              </span>
            </div>
          </div>
          <div className="detail-description">
            <h3>A flavour with a story</h3>
            <p>{product.description}</p>
            <p>
              Keep sealed in a cool, dry place. Use a dry spoon and adjust
              quantity to your taste.
            </p>
          </div>
        </div>
      </div>
      <section className="section related">
        <SectionTitle
          eyebrow="KEEP EXPLORING"
          title="More to love"
          link="Shop all"
        />
        <div className="product-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </div>
      </section>
    </main>
  );
}
function About() {
  return (
    <main>
      <div className="page-hero about-hero">
        <span className="eyebrow">OUR STORY · OUR SOUL</span>
        <h1>
          Not just masala.
          <br />A little <em>piece of home.</em>
        </h1>
        <p>
          Because the best flavours are never just about food. They're about who
          we share it with.
        </p>
      </div>
      <section className="about-intro container">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=85"
            alt="Warm kitchen and ingredients"
          />
        </div>
        <div className="about-copy">
          <span className="eyebrow">HOW IT ALL BEGAN</span>
          <h2>
            A kitchen full of aromas.
            <br />A heart full of <em>memories.</em>
          </h2>
          <p>
            It began, as the best things often do, in a family kitchen. The kind
            where the pressure cooker sings, the tadka crackles, and someone
            always asks, “What's that wonderful smell?”
          </p>
          <p>
            We grew up believing that a good masala could do more than flavour a
            dish. It could bring a quiet Tuesday dinner to life. It could turn a
            first attempt at a family recipe into a proud little victory. It
            could make a faraway home feel a little closer.
          </p>
          <p>
            But the most treasured recipes were rarely written down. They lived
            in a pinch of this, a handful of that, and years of tasting,
            learning and sharing.{" "}
            <strong>Swaad Sutra was born to honour that beautiful art.</strong>
          </p>
          <p>
            Our name brings together <em>swaad</em> — taste — and <em>sutra</em>{" "}
            — a thread that connects. We make blends inspired by the flavours we
            grew up loving, created for the kitchens we're cooking in today.
          </p>
          <div className="signature">
            <span>With warmth,</span>
            <strong>The Swaad Sutra family</strong>
            <i>✳</i>
          </div>
        </div>
      </section>
      <section className="values-section">
        <div className="container">
          <SectionTitle
            eyebrow="WHAT WE BELIEVE"
            title="Our promise, in every pinch."
          />
          <div className="values-grid">
            <article>
              <span>01</span>
              <Leaf />
              <h3>Respect the roots</h3>
              <p>
                We take inspiration from the regional kitchens and generations
                of cooks that keep food traditions alive.
              </p>
            </article>
            <article>
              <span>02</span>
              <Sparkles />
              <h3>Let flavour lead</h3>
              <p>
                Every blend should earn its place in your pantry and make
                everyday cooking feel special.
              </p>
            </article>
            <article>
              <span>03</span>
              <Heart />
              <h3>Made to be shared</h3>
              <p>
                Food is connection. We want our masalas to be part of the meals,
                stories and moments you remember.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="about-cta container">
        <div>
          <span className="eyebrow">YOUR KITCHEN, OUR INSPIRATION</span>
          <h2>
            Let's make something
            <br />
            <em>delicious together.</em>
          </h2>
        </div>
        <Link to="/shop" className="btn btn-dark">
          Explore our masalas <ArrowRight />
        </Link>
      </section>
    </main>
  );
}
function Contact() {
  const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    }),
    [state, setState] = useState({
      loading: false,
      error: "",
      success: "",
      whatsappSent: false,
    });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: "", success: "", whatsappSent: false });
    try {
      const r = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Unable to send message.");
      setState({
        loading: false,
        error: "",
        success: d.message,
        whatsappSent: d.whatsappSent,
      });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setState({
        loading: false,
        error: err.message,
        success: "",
        whatsappSent: false,
      });
    }
  }
  const address =
    import.meta.env.VITE_BUSINESS_ADDRESS || "Pune, Maharashtra, India";
  return (
    <main>
      <div className="page-hero contact-hero">
        <span className="eyebrow">WE'RE ALL EARS</span>
        <h1>
          Have a little <em>something</em>
          <br />
          on your mind?
        </h1>
        <p>
          Questions, kitchen stories, or just want to say hello? We'd love to
          hear from you.
        </p>
      </div>
      <section className="contact-layout container">
        <div className="contact-info">
          <span className="eyebrow">LET'S TALK</span>
          <h2>
            Good conversations
            <br />
            start with <em>hello.</em>
          </h2>
          <p>
            Tell us what you're cooking, what you're curious about, or how we
            can help.
          </p>
          <div className="contact-detail">
            <span>
              <MapPin />
            </span>
            <div>
              <b>Come say hello</b>
              <p>{address}</p>
            </div>
          </div>
          <div className="contact-detail">
            <span>
              <Clock />
            </span>
            <div>
              <b>Kitchen hours</b>
              <p>
                Monday–Saturday
                <br />
                9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>
          <div className="contact-detail">
            <span>
              <ShoppingBag />
            </span>
            <div>
              <b>Order support</b>
              <p>
                Questions about your order? Include your order number in the
                message.
              </p>
            </div>
          </div>
          <div className="map-frame">
            <iframe
              title="Map of Pune, Maharashtra"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps <ArrowRight />
            </a>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <span className="eyebrow">SEND A NOTE</span>
          <h2>Write us a little something.</h2>
          <p>We usually reply within one business day.</p>
          {state.error && <div className="form-alert error">{state.error}</div>}
          {state.success && (
            <div className="form-alert success">
              <Check /> {state.success}
              {!state.whatsappSent && (
                <small>
                  Your message was saved. WhatsApp notification may not be
                  configured yet.
                </small>
              )}
            </div>
          )}
          <div className="form-row">
            <label>
              Your name *
              <input
                required
                minLength="2"
                name="name"
                value={form.name}
                onChange={update}
                placeholder="What should we call you?"
              />
            </label>
            <label>
              Email address *
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Phone number
              <input
                name="phone"
                value={form.phone}
                onChange={update}
                placeholder="+91"
              />
            </label>
            <label>
              What is it about?
              <select name="subject" value={form.subject} onChange={update}>
                <option value="">Choose a topic</option>
                <option>Order enquiry</option>
                <option>Product question</option>
                <option>Wholesale & partnerships</option>
                <option>Just saying hello</option>
              </select>
            </label>
          </div>
          <label>
            Your message *
            <textarea
              required
              minLength="10"
              name="message"
              value={form.message}
              onChange={update}
              placeholder="Tell us what's on your mind…"
              rows="5"
            />
          </label>
          <button className="btn btn-dark form-submit" disabled={state.loading}>
            {state.loading ? (
              "Sending your note…"
            ) : (
              <>
                Send your message <ArrowRight />
              </>
            )}
          </button>
          <small className="privacy-note">
            <ShieldCheck size={14} /> Your details are used only to respond to
            your enquiry.
          </small>
        </form>
      </section>
    </main>
  );
}
function Cart() {
  const { cart, total, setQuantity, remove } = useStore();
  const shipping = total >= 799 ? 0 : cart.length ? 49 : 0;
  return (
    <main className="container cart-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        Your bag
      </div>
      <div className="cart-heading">
        <div>
          <span className="eyebrow">A GOOD CHOICE</span>
          <h1>
            Your <em>bag.</em>
          </h1>
        </div>
        <Link to="/shop" className="text-link">
          Keep exploring <ArrowRight />
        </Link>
      </div>
      {!cart.length ? (
        <div className="empty-state">
          <ShoppingBag />
          <h2>Your bag is taking a little break.</h2>
          <p>Find the flavours that make your kitchen feel like home.</p>
          <Link className="btn btn-dark" to="/shop">
            Explore masalas <ArrowRight />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link to={`/product/${item.slug}`} className="cart-item-image">
                  <img src={imageFor(item)} alt={item.name} />
                </Link>
                <div className="cart-item-details">
                  <Link to={`/product/${item.slug}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <span>{item.pack_size}</span>
                  <strong>{money(item.price)}</strong>
                  <div className="qty-control">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <b>{money(item.price * item.quantity)}</b>
                  <button
                    className="remove-button"
                    onClick={() => remove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <div>
              <span>Delivery</span>
              <b>{shipping === 0 ? "FREE" : money(shipping)}</b>
            </div>
            {total < 799 && (
              <p className="shipping-nudge">
                You're {money(799 - total)} away from free delivery.
              </p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <strong>{money(total + shipping)}</strong>
            </div>
            <Link to="/checkout" className="btn btn-dark checkout-btn">
              Continue to checkout <ArrowRight />
            </Link>
            <p className="secure-note">
              <ShieldCheck /> Secure checkout · COD available
            </p>
            <Link className="underlined-link" to="/shop">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
function Checkout() {
  const { cart, total, clear } = useStore();
  const nav = useNavigate();
  const [payment, setPayment] = useState("COD");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [payConfig, setPayConfig] = useState({
    razorpayEnabled: false,
    razorpayKeyId: null,
  });
  useEffect(() => {
    fetch(`${API}/config/payment`)
      .then((r) => r.json())
      .then(setPayConfig)
      .catch(() => {});
  }, []);
  const shipping = total >= 799 ? 0 : cart.length ? 49 : 0;
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function place(e) {
    e.preventDefault();
    if (!cart.length) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          paymentMethod: payment,
          items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to place order.");
      if (payment === "COD") {
        clear();
        nav("/order-success", {
          state: {
            orderNumber: data.orderNumber,
            total: data.total,
            paymentMethod: "COD",
          },
        });
        return;
      }
      if (!window.Razorpay)
        throw new Error(
          "Razorpay checkout could not load. Refresh the page or use Cash on Delivery.",
        );
      const checkout = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "Swaad Sutra",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpay.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#20382a" },
        handler: async function (result) {
          const verify = await fetch(
            `${API}/orders/${data.orderId}/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(result),
            },
          );
          const verified = await verify.json();
          if (!verify.ok || !verified.success) {
            setError(verified.message || "Payment verification failed.");
            setBusy(false);
            return;
          }
          clear();
          nav("/order-success", {
            state: {
              orderNumber: verified.orderNumber,
              total: data.total,
              paymentMethod: "RAZORPAY",
            },
          });
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      checkout.on("payment.failed", () => {
        setError(
          "Payment did not complete. You can retry or choose Cash on Delivery.",
        );
        setBusy(false);
      });
      checkout.open();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  if (!cart.length)
    return (
      <main className="container empty-state checkout-empty">
        <ShoppingBag />
        <h2>Your bag is empty</h2>
        <Link className="btn btn-dark" to="/shop">
          Shop masalas
        </Link>
      </main>
    );
  return (
    <main className="container checkout-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight />
        <Link to="/cart">Your bag</Link>
        <ChevronRight />
        Checkout
      </div>
      <h1>
        Let's get this <em>to your kitchen.</em>
      </h1>
      <form className="checkout-layout" onSubmit={place}>
        <div className="checkout-fields">
          <section className="checkout-panel">
            <span className="step-number">01</span>
            <h2>Delivery details</h2>
            <div className="form-row">
              <label>
                Full name *
                <input
                  required
                  name="name"
                  minLength="2"
                  value={form.name}
                  onChange={update}
                />
              </label>
              <label>
                Email address *
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone number *
                <input
                  required
                  name="phone"
                  minLength="8"
                  value={form.phone}
                  onChange={update}
                />
              </label>
              <label>
                PIN code *
                <input
                  required
                  name="postalCode"
                  minLength="4"
                  value={form.postalCode}
                  onChange={update}
                />
              </label>
            </div>
            <label>
              Full delivery address *
              <textarea
                required
                name="address"
                minLength="8"
                rows="3"
                value={form.address}
                onChange={update}
              />
            </label>
            <label>
              City *
              <input
                required
                name="city"
                minLength="2"
                value={form.city}
                onChange={update}
              />
            </label>
          </section>
          <section className="checkout-panel">
            <span className="step-number">02</span>
            <h2>Payment method</h2>
            <label
              className={`payment-option ${payment === "COD" ? "selected" : ""}`}
            >
              <input
                type="radio"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              <span>
                <b>Cash on Delivery</b>
                <small>Pay when your order arrives</small>
              </span>
              <span className="payment-chip">AVAILABLE</span>
            </label>
            <label
              className={`payment-option ${payment === "RAZORPAY" ? "selected" : ""} ${!payConfig.razorpayEnabled ? "disabled" : ""}`}
            >
              <input
                type="radio"
                checked={payment === "RAZORPAY"}
                disabled={!payConfig.razorpayEnabled}
                onChange={() => setPayment("RAZORPAY")}
              />
              <span>
                <b>Pay online securely</b>
                <small>UPI, cards and net banking via Razorpay</small>
                {!payConfig.razorpayEnabled && (
                  <small className="muted">
                    Online payment will appear after the store owner configures
                    Razorpay.
                  </small>
                )}
              </span>
              <span className="payment-chip">RAZORPAY</span>
            </label>
          </section>
        </div>
        <aside className="order-summary">
          <h2>Your order</h2>
          {cart.map((i) => (
            <div className="checkout-item" key={i.id}>
              <img src={imageFor(i)} alt="" />
              <span>
                {i.name}
                <small>Qty {i.quantity}</small>
              </span>
              <b>{money(i.price * i.quantity)}</b>
            </div>
          ))}
          <div>
            <span>Subtotal</span>
            <b>{money(total)}</b>
          </div>
          <div>
            <span>Delivery</span>
            <b>{shipping ? money(shipping) : "FREE"}</b>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total + shipping)}</strong>
          </div>
          {error && <div className="form-alert error">{error}</div>}
          <button disabled={busy} className="btn btn-dark checkout-btn">
            {busy
              ? "Processing…"
              : payment === "COD"
                ? "Place COD order"
                : "Continue to secure payment"}{" "}
            <ArrowRight />
          </button>
          <p className="secure-note">
            <ShieldCheck /> Your information is sent securely.
          </p>
        </aside>
      </form>
    </main>
  );
}
function OrderSuccess() {
  const { state } = useNavigate().location || {}; // location may not be exposed on navigate; use dedicated hook below in actual route
  return <OrderSuccessContent />;
}
function OrderSuccessContent() {
  const [params] = useSearchParams();
  const { state } = window.history.state || {};
  const orderNumber =
    state?.usr?.orderNumber || params.get("order") || "Your order";
  const total = state?.usr?.total;
  const method = state?.usr?.paymentMethod || "COD";
  return (
    <main className="success-page container">
      <div className="success-mark">
        <Check />
      </div>
      <span className="eyebrow">A DELICIOUS CHOICE</span>
      <h1>
        Your order is in.
        <br />
        <em>Let the flavour begin.</em>
      </h1>
      <p>
        Thank you for welcoming Swaad Sutra into your kitchen. We've received
        your order.
      </p>
      <div className="success-card">
        <span>ORDER REFERENCE</span>
        <strong>{orderNumber}</strong>
        {total != null && (
          <div>
            <span>Order total</span>
            <b>{money(total)}</b>
          </div>
        )}
        <div>
          <span>Payment method</span>
          <b>{method === "COD" ? "Cash on Delivery" : "Online payment"}</b>
        </div>
      </div>
      <p className="success-note">
        For order updates, please keep your phone handy. Owner WhatsApp
        notifications require the store's WhatsApp Cloud API setup.
      </p>
      <Link to="/shop" className="btn btn-dark">
        Back to the pantry <ArrowRight />
      </Link>
    </main>
  );
}
function NotFound() {
  return (
    <main className="empty-state container">
      <span className="eyebrow">WRONG TURN, RIGHT FLAVOUR</span>
      <h1>We couldn't find that page.</h1>
      <Link to="/" className="btn btn-dark">
        Back home
      </Link>
    </main>
  );
}
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccessContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <a
        className="whatsapp-float"
        href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_DISPLAY_NUMBER || "910000000000").replace(/\D/g, "")}?text=${encodeURIComponent("Hi Swaad Sutra, I have a question about your masalas.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <span>Chat with us</span>
        <MessageIcon />
      </a>
    </>
  );
}
function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.91 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
