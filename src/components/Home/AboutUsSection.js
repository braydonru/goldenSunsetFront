import React from 'react';
import './AboutUs.css';
import { Heart, Users, Star, Coffee, Sunset, Award, Target, Shield } from 'lucide-react';

const AboutUsSection = () => {
    return (
        <div className="about-us-container">
            <div className="about-us-content">

                {/* Hero Section */}
                <div className="hero-section">
                    <h1 className="company-title">
                        <span className="company-title-accent">Golden Sunset</span> Made by Josh
                    </h1>
                    <p className="company-tagline">
                        "Your imagination takes the lead, we just put our heart into it! 🎨✨"
                    </p>
                </div>

                {/* Company Story */}
                <div className="story-card">
                    <div className="section-header">
                        <Sunset className="section-icon" />
                        <h2 className="section-title-us">From Garage to Heart: Josh's Dream</h2>
                    </div>

                    <div className="story-grid">
                        <div>
                            <p className="story-text">
                                Behind every design that leaves our workshop is a story of courage, sea sand, and lots of passion.
                            </p>
                            <p className="story-text">
                                Our adventure didn't start in a fancy office, but in a <span className="highlight">family garage in Los Angeles</span>.
                                We're a small team of two people with one giant goal: to prove that art knows no barriers.
                            </p>
                        </div>
                        <div className="josh-card">
                            <h3 className="josh-title">Meet Josh: The Soul of the Company</h3>
                            <div className="josh-details">
                                <div className="detail-item">
                                    <Users className="detail-icon" />
                                    <span>32-year-old adventurer and athlete</span>
                                </div>
                                <div className="detail-item">
                                    <Target className="detail-icon" />
                                    <span>Born and raised under the California sun</span>
                                </div>
                                <div className="detail-item">
                                    <Heart className="detail-icon" />
                                    <span>Special needs advocate and entrepreneur</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="philosophy-section">
                    <div className="section-header">
                        <Heart className="section-icon" />
                        <h2 className="section-title-us">Our Philosophy: Love in Every Detail</h2>
                    </div>
                    <div className="philosophy-grid">
                        <div>
                            <p className="philosophy-quote">
                                "We don't aim to be the best in the world, but the most passionate."
                            </p>
                            <p className="philosophy-text">
                                There are no "small" orders here. Every shirt we print and every cap we embroider is
                                treated with absolute dedication, with the same love and professionalism as if it were
                                a gift <span className="highlight-bold">for our own mother.</span>
                            </p>
                        </div>
                        <div className="guarantee-card">
                            <h3 className="guarantee-title">The Josh Guarantee</h3>
                            <p className="guarantee-text">
                                "Josh personally supervises the quality of every product. If we wouldn't be happy with
                                how it looks in our home, it doesn't leave our garage for yours."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="services-section">
                    <h2 className="services-title">
                        How We Bring Your Ideas to Life 🛠️
                    </h2>

                    <div className="services-grid">
                        <div className="service-card sublimation">
                            <div className="service-header">
                                <div className="service-icon-wrapper">
                                    <Award className="service-icon" />
                                </div>
                                <h3 className="service-name">Premium Sublimation</h3>
                            </div>
                            <p className="service-description">
                                Vibrant colors on t-shirts, sweatshirts, mugs, tumblers, and metal plates.
                                The design fuses with the material—it won't crack or fade with washing.
                            </p>
                        </div>

                        <div className="service-card embroidery">
                            <div className="service-header">
                                <div className="service-icon-wrapper">
                                    <Shield className="service-icon" />
                                </div>
                                <h3 className="service-name">Detailed Embroidery</h3>
                            </div>
                            <p className="service-description">
                                An elegant, durable touch for your t-shirts, caps, and shorts. Made with
                                high-quality threads to withstand your adventurous pace—just like Josh's style!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Process Section */}
                <div className="process-section">
                    <h2 className="process-title">
                        🎨 Guide for the Artist: How to Send Us Your Design
                    </h2>

                    <div className="process-steps">
                        {[
                            { step: "1", title: "Choose Canvas", desc: "Select your product in our shop" },
                            { step: "2", title: "Prepare File", desc: "High-res PNG or PDF for best results" },
                            { step: "3", title: "Select Size", desc: "Choose design position and size" },
                            { step: "4", title: "Send Idea", desc: "Attach file with your order number" },
                            { step: "5", title: "Love Approval", desc: "Josh reviews before production" }
                        ].map((item) => (
                            <div key={item.step} className="process-step">
                                <div className="step-number">{item.step}</div>
                                <h4 className="step-title">{item.title}</h4>
                                <p className="step-description">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="why-choose-section">
                    <div className="why-badge">
                        <Star className="badge-icon" />
                        <span className="badge-text">WHY CHOOSE US?</span>
                    </div>

                    <h3 className="why-title">
                        Why choose us instead of a large printing company?
                    </h3>

                    <p className="why-description">
                        Because here, you're not just another order number. By choosing us, you're supporting
                        the dream of a young entrepreneur with special needs who loves art. You're buying
                        a piece made with passionate hands, dedication, and a story of overcoming challenges.
                    </p>
                </div>

                {/* Note */}
                <div className="closing-note">
                    <Coffee className="note-icon" />
                    <p className="note-text">
                        Thank you for being part of our story. Every order helps Josh continue his adventure
                        and brings more color into the world.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AboutUsSection;