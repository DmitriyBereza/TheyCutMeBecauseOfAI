import companies from "@/data/companies.json";
import { Company } from "@/lib/types";

export function getCompanies(): Company[] {
  return companies as Company[];
}

export function getCompany(slug: string): Company | undefined {
  return getCompanies().find((c) => c.slug === slug);
}

export function totals() {
  const cos = getCompanies();
  const totalCut = cos.reduce(
    (a, c) => a + c.layoffs.reduce((x, e) => x + e.number_cut, 0),
    0
  );
  const aiCut = cos.reduce(
    (a, c) =>
      a +
      c.layoffs.filter((e) => e.ai_related).reduce((x, e) => x + e.number_cut, 0),
    0
  );
  return { companies: cos.length, totalCut, aiCut };
}
