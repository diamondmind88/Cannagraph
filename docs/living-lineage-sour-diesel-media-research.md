# Sour Diesel reference-media research — initial discovery (2026-11-15)

## Objective
Find documented, attributable full-plant photographs suitable for calibrating Cannagraph's reference-based plant structure studio. This is a discovery index, **not** a licensed media collection or proof of cultivar identity.

## Initial candidates

| Source | URL | What it offers | Caveat |
| --- | --- | --- | --- |
| GrowDiaries — Sour Diesel explorer | https://growdiaries.com/explore/sour-diesel | Hundreds of grow-journal entries with stage-specific photos; can filter by seedbank and training | Sour Diesel is a shared commercial name; entries span different seed lines and cuts |
| GrowDiaries — custom Sour Diesel gallery | https://growdiaries.com/seedbank/Custom/sour-diesel | Many user-uploaded galleries, including an East Coast Sour Diesel diary | Confirm each image's attribution, cultivar provenance, growth stage, and permissions |
| GrowDiaries — DogDoctorOfficial diary | https://growdiaries.com/diaries/295826-grow-journal-by-dogdoctorofficial | Multiweek photographed plant; documented as Zamnesia Sour Diesel | Not evidence of clone-only ECSD; notes unusually compact expression |
| GrowDiaries — ILGM diary | https://growdiaries.com/diaries/189519-ilgm-sour-diesel-grow-journal-by-itsgrowingonme | Longitudinal photos and explicit topping/LST context | Training strongly changes architecture; ILGM seed line |
| ICMag — ECSD Monstah | https://www.icmag.com/threads/ecsd-monstah.99766/ | Historical ECSD grower thread with plant/cola photos | Many closeups rather than isolated full plants; rights and exact identity unverified |
| Leafly Sour Diesel photos | https://www.leafly.com/strains/sour-diesel/photos | User-submitted flowering photos | Mixed identities, uncertain attribution, not automatically reusable |
| Royal Queen Seeds Sour Diesel article | https://www.royalqueenseeds.es/blog-sour-diesel-feminizadas-cepa-de-cannabis-n41 | Photos across flowering under screen training | Breeder-specific seed line; training obscures untrained shape |

## Required record fields
- source_url, image_page_url, original_author, photographer_permission, license, attribution
- claimed_cultivar_name, claimed_breeder, claimed_cut_or_seedline, identity_confidence
- grow_stage, weeks_in_flower, training_method, indoor_or_outdoor
- view_angle, whole_plant_visible, root_or_container_visible, scale_reference
- usable_for_structure (yes/no), use_constraints, notes, retrieved_at

## Selection rules
1. Prefer a full plant in frame, one plant per image, with visible main stem and branches.
2. Favor a sequence from one grower/one plant over unrelated photographs stitched together.
3. Do not infer clone identity from strain name or merge breeder seed lines.
4. Preserve source URL and original attribution. Do not bulk-download or republish until licensing, site terms and permission are checked.
5. Use morphology measurements as *observations of one phenotype under documented conditions*, never universal strain traits.
6. Store original photos only with appropriate rights; otherwise retain external links and derived measurements where allowed.

## Next implementation
Add a curated reference-media manifest with explicit review and rights fields. Build a browser-assisted review queue for image candidates, then use the selected reference in the existing /living-lineage/reference-studio route. The current studio requires local photo selection; this research index does not claim automatic import or automatic 3D reconstruction.
