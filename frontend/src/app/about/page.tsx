import { Container } from '@/components/ui/container';
import { HeroBanner } from '@/components/common/HeroBanner';
import { getAboutPageContent } from '@/lib/api/page-content';
import { getAboutMetadata } from '@/lib/api/page-seo';

export async function generateMetadata() {
  return getAboutMetadata();
}

export default async function AboutPage() {
  const content = await getAboutPageContent();
  const paragraphs = content.body?.split('\n\n').filter((paragraph) => paragraph.trim()) ?? [];

  return (
    <>
      <HeroBanner
        image={content.heroImage}
        title={content.heroTitle}
        heightClass="h-[50vh]"
        contentPosition="bottom"
        overlayClass="bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      />

      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-teal max-w-none text-gray-700">
              {content.heroSubtitle ? (
                <p className="text-xl leading-relaxed text-primary mb-8 font-medium border-l-4 border-primary pl-6 py-2 bg-teal-50/50 rounded-r-lg whitespace-pre-line">
                  {content.heroSubtitle}
                </p>
              ) : null}

              {paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none pt-2 mb-6 whitespace-pre-line'
                      : 'mb-6 whitespace-pre-line'
                  }
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
