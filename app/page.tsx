import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden mt-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/guarda/se-catedral-da-guarda.jpg"
            alt="Beautiful view of Guarda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome to Erasmus33
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your gateway to unforgettable experiences in Guarda, Portugal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/auth/sign-up">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 bg-cover bg-center">
        <div className="relative z-10 max-w-7xl mx-auto"> {/* Added relative and z-10 to ensure content is above overlay */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
            <p className="text-lg text-muted-foreground">Everything you need for a successful Erasmus experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Badge variant="secondary" className="mt-1">01</Badge>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Quality Accommodation</h3>
                  <p className="text-muted-foreground">
                    Comfortable, fully-furnished rooms and apartments in prime locations throughout Guarda
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="secondary" className="mt-1">02</Badge>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cultural Integration</h3>
                  <p className="text-muted-foreground">
                    Guided tours, cultural events, and local experiences to help you integrate into Portuguese culture
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge variant="secondary" className="mt-1">03</Badge>
                <div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Round-the-clock assistance for any questions or concerns during your stay
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden ">
              <Image
                src="/assets/logo.png"
                alt="Erasmus33 Logo"
                fill
                className="object-contain transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 px-4 bg-[url('/assets/misc/mapa.png')] bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-black/60 z-0" /> {/* Added transparent overlay */}
        <div className="relative z-10 max-w-7xl mx-auto"> {/* Ensured content is above overlay */}
          <div className="text-center mb-16 p-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Guarda with Erasmus33</h2>
            <p className="text-lg max-w-3xl mx-auto">
              We provide exceptional accommodation and experiences for international students in the historic city of Guarda.
              From comfortable housing to cultural adventures, we make your Erasmus journey unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/erasmus/piquinique.jpg"
                  alt="Students enjoying a picnic"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Student Community</CardTitle>
                <CardDescription>
                  Join a vibrant community of international students and create lasting friendships
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/guarda/catedral.jpg"
                  alt="Guarda Cathedral"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Historic City</CardTitle>
                <CardDescription>
                  Explore the rich history and stunning architecture of Portugal&apos;s highest city
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/erasmus/jogando-bola.jpg"
                  alt="Students playing sports"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Active Lifestyle</CardTitle>
                <CardDescription>
                  Enjoy sports, outdoor activities, and a healthy lifestyle in beautiful surroundings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Student Experiences</h2>
            <p className="text-lg text-muted-foreground">See what life is like for our Erasmus students</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/guarda/guarda.jpg"
                alt="Munícipio da Guarda"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/guarda/estrela-geopark.jpg"
                alt="Estrela Geopark"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/guarda/centro-de-turismo.jpg"
                alt="Centro de Turismo"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/images/guarda/visit-portugal.jpg"
                alt="Visit Portugal"
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-primary text-primary-foreground">
        <Image
          src="/assets/misc/textured-mulberry-paper.jpg"
          alt="Map background"
          fill
          className="object-cover"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of international students who have made Guarda their home away from home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" variant="secondary" color="blue">
              <Link href="/auth/sign-up">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/assets/logo.png" alt="Erasmus33" />
              </Avatar>
              <p className="text-sm text-muted-foreground">
                Making Erasmus experiences unforgettable in the beautiful city of Guarda, Portugal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/protected/houses" className="hover:text-foreground">Accommodation</Link></li>
                <li><Link href="/protected/rooms" className="hover:text-foreground">Room Rentals</Link></li>
                <li><Link href="https://turismodocentro.pt/artigo/roteiros-literarios-no-centro-de-portugal/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Cultural Tours</Link></li>
                <li><Link href="/profile" className="hover:text-foreground">Support Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About Guarda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="https://turismodocentro.pt/regiao/serra-da-estrela/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">City Guide</Link></li>
                <li><Link href="https://turismodocentro.pt/artigo/escapadinhas-para-2025/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Local Events</Link></li>
                <li><Link href="https://www.cp.pt/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Transportation</Link></li>
                <li><Link href="https://112.pt/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Emergency Info</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: guarda.erasmus33@gmail.com</li>
                <li>Phone: +351 XXX XXX XXX</li>
                <li>Address: Guarda, Portugal</li>
              </ul>
              <div className="mt-6">
                <h5 className="font-semibold mb-3 text-foreground">Follow Us</h5>
                <div className="flex gap-3">
                  <Link
                    href="https://www.instagram.com/erasmus33.guarda?utm_source=ig_web_button_share_sheet&igsh=MWh6MzQ5a2Nrdzdvbw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </Link>
                  <Link
                    href="https://www.facebook.com/helderasmus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 Erasmus33. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
