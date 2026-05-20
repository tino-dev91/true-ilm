import Image from "next/image";

export function BooksMarquee({ label }: { label: string }) {
  return (
    <div className="books">
      <div className="label">{label}</div>
      <div className="books-marquee">
        <div className="books-track">
          <Image src="/books-strip.png" alt="True ILM library" width={3840} height={854} priority />
          <Image src="/books-strip.png" alt="" aria-hidden width={3840} height={854} />
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
