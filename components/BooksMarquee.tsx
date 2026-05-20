import Image from "next/image";

export function BooksMarquee({ label }: { label: string }) {
  return (
    <div className="books">
      <div className="label">{label}</div>
      <div className="books-marquee">
        <div className="books-track">
          <Image src="/books-strip.webp" alt="True ILM library" width={13510} height={406} unoptimized priority />
          <Image src="/books-strip.webp" alt="" aria-hidden width={13510} height={406} unoptimized />
        </div>
      </div>
      <div className="books-stats">
        <span>
          <b>500+</b> eBooks
        </span>
        <span>
          <b>250+</b> audiobooks
        </span>
        <span>
          <b>No</b> ads
        </span>
      </div>
    </div>
  );
}
