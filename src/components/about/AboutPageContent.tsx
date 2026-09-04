"use client";

import { PageHero, SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { galleryImages as fallbackGallery } from "@/data/site";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { bilingualOr } from "@/lib/cms-copy";

export function AboutPageContent() {
  const { t, locale } = useLocale();
  const { siteSettings, galleryImages } = useData();

  const galleryTitle = bilingualOr(
    siteSettings.aboutGalleryTitle,
    locale,
    t.about.galleryTitle,
  );
  const storyImage = siteSettings.aboutStoryImageUrl;

  const gallery =
    galleryImages.length > 0
      ? galleryImages.map((image) => ({
          key: image.id,
          src: image.imageUrl,
          alt: image.title[locale],
        }))
      : fallbackGallery.map((src, index) => ({
          key: src,
          src,
          alt: `${galleryTitle} ${index + 1}`,
        }));

  return (
    <>
      <PageHero
        title={bilingualOr(siteSettings.aboutPageTitle, locale, t.about.pageTitle)}
        subtitle={bilingualOr(
          siteSettings.aboutPageSubtitle,
          locale,
          t.about.pageSubtitle,
        )}
      />

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <SectionHeading
              title={bilingualOr(
                siteSettings.aboutStoryTitle,
                locale,
                t.about.storyTitle,
              )}
            />
            {storyImage ? (
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SmartImage
                  src={storyImage}
                  alt={bilingualOr(
                    siteSettings.aboutStoryTitle,
                    locale,
                    t.about.storyTitle,
                  )}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
          <p
            className="text-sm leading-8 sm:text-base lg:pt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {bilingualOr(siteSettings.aboutStory, locale, t.about.storyBody)}
          </p>
        </div>
      </section>

      <section
        className="border-t px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <SectionHeading title={galleryTitle} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {gallery.map((image, index) => (
              <div
                key={image.key}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  index === 0 ? "col-span-2 aspect-[16/9] lg:col-span-2" : "aspect-square"
                }`}
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SmartImage
                  src={image.src}
                  alt={image.alt || `${galleryTitle} ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
