"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
} as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About ManuaLink</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
            Connecting skilled Kenyan workers with employers who need them. Our
            mission is to create opportunities and support Kenya&apos;s workforce.
          </p>
        </motion.div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            className="rounded-xl bg-white p-8 shadow-lg transition hover:shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
              <i className="fas fa-bullseye text-2xl text-blue-600" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">Our Mission</h2>
            <p className="text-gray-600">
              To bridge the gap between skilled manual workers and employers in
              Kenya, creating economic opportunities and making it easier to
              find reliable work or workers.
            </p>
          </motion.div>

          <motion.div
            className="rounded-xl bg-white p-8 shadow-lg transition hover:shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
              <i className="fas fa-eye text-2xl text-blue-600" />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">Our Vision</h2>
            <p className="text-gray-600">
              To become Kenya&apos;s leading platform for manual work
              connections, empowering thousands of workers and transforming how
              businesses find skilled labor.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mb-12 rounded-xl bg-white p-8 shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="mb-6 text-center text-3xl font-bold">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              ManuaLink was founded in 2025 in response to the growing need for
              a reliable platform connecting skilled manual workers with
              employers across Kenya.
            </p>
            <p>
              Our founders witnessed firsthand the challenges faced by both
              workers seeking consistent employment and employers struggling to
              find qualified, reliable help for construction, farming,
              cleaning, and other manual work.
            </p>
            <p>
              Today, we&apos;re proud to have built a platform that serves
              thousands of Kenyans, helping them find work opportunities and
              build better lives for themselves and their families.
            </p>
          </div>
        </motion.div>

        <div className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Team</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Sayan Nyariki",
                role: "Founder & CEO",
                description:
                  "Experienced entrepreneur with a passion for economic empowerment.",
                image: "/team/sayan.jpg",
              },
              {
                name: "Sarah Achieng",
                role: "Head of Operations",
                description:
                  "Dedicated to creating seamless experiences for our users.",
                image: "/team/sarah.jpg",
              },
              {
                name: "David Ochieng",
                role: "Technical Lead",
                description:
                  "Ensuring our platform remains reliable and easy to use.",
                image: "/team/david.jpg",
              },
              {
                name: "Grace Wambui",
                role: "Community Manager",
                description:
                  "Building and nurturing our community of workers and employers.",
                image: "/team/grace.jpg",
              },
            ].map((member) => (
              <motion.div
                key={member.name}
                className="rounded-xl bg-white p-6 text-center shadow-lg transition hover:shadow-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-1 font-semibold">{member.name}</h3>
                <p className="mb-2 text-sm text-blue-600">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
