import { Star } from "lucide-react";

interface TestimonialProps {
    initialData?: any[];
}

export default function Testimonials({ initialData = [] }: TestimonialProps) {
    const defaultReviews = [
        {
            name: "Budi Santoso",
            content: "Layanan sangat memuaskan! Mobil klien saya mogok di tol jam 2 pagi, dalam 20 menit derek sudah sampai. Sangat direkomendasikan.",
            rating: 5
        },
        {
            name: "Siska Wijaya",
            content: "Awalnya panik karena ban pecah di jalan sepi. Untung ada layanan towing ini. Drivernya ramah dan sangat membantu.",
            rating: 5
        }
    ];

    const reviews = initialData.length > 0 ? initialData : defaultReviews;

    return (
        <section className="py-24 bg-zinc-900 border-t border-zinc-800 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
                        Apa Kata <span className="text-zinc-500">Mereka?</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl relative">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 text-zinc-800">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                </svg>
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                                ))}
                            </div>

                            <p className="text-zinc-300 mb-6 italic leading-relaxed">"{review.content}"</p>

                            <div>
                                <h4 className="font-bold text-white">{review.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
