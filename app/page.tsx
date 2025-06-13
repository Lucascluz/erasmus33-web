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
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Guarda with Erasmus33</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
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
                  Explore the rich history and stunning architecture of Portugal's highest city
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

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
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
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/assets/logo.png"
                alt="Estrela Geopark"
                fill
                className="object-contain transition-transform animate-pulse hover:scale-105"
              />
            </div>
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
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of international students who have made Guarda their home away from home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/sign-up">Get Started Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/protected/houses">View Available Housing</Link>
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
                <li><Link href="#" className="hover:text-foreground">Cultural Tours</Link></li>
                <li><Link href="#" className="hover:text-foreground">Support Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About Guarda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">City Guide</Link></li>
                <li><Link href="#" className="hover:text-foreground">Local Events</Link></li>
                <li><Link href="#" className="hover:text-foreground">Transportation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Emergency Info</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: guarda.erasmus33@gmail.com</li>
                <li>Phone: +351 XXX XXX XXX</li>
                <li>Address: Guarda, Portugal</li>
              </ul>
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
