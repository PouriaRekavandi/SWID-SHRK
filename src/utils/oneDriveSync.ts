export interface OneDriveItem {
  id: string;
  name: string;
  size?: number;
  lastModifiedDateTime?: string;
  webUrl?: string;
  downloadUrl?: string;
}

// Default SWID-SHRK Cloud Research Repository files for OneDrive sync demonstration
export const SAMPLE_ONEDRIVE_PAPERS: OneDriveItem[] = [
  {
    id: 'onedrive-fgm-2024',
    name: 'Hejazi_Rekavandi_FGM_Cylinders_Fatigue_2024.pdf',
    size: 2450000,
    lastModifiedDateTime: '2025-01-15T14:30:00Z',
    webUrl: 'https://1drv.ms/b/s!swid_shrk_fgm_cylinders_fatigue',
  },
  {
    id: 'onedrive-antiprism-2025',
    name: 'Antiprism_Strut_Cellular_Metamaterials_SEA_Abaqus.pdf',
    size: 3820000,
    lastModifiedDateTime: '2025-02-02T10:15:00Z',
    webUrl: 'https://1drv.ms/b/s!swid_shrk_antiprism_strut_sea',
  },
  {
    id: 'onedrive-brain-visco-2025',
    name: 'Brain_Parenchyma_Viscoelastic_Trauma_VUMAT.pdf',
    size: 1980000,
    lastModifiedDateTime: '2025-02-18T16:45:00Z',
    webUrl: 'https://1drv.ms/b/s!swid_shrk_brain_viscoelastic_vumat',
  },
];

export async function parseOneDriveShareLink(link: string): Promise<{ base64?: string; name: string; text?: string }> {
  const cleanLink = link.trim();
  if (!cleanLink) {
    throw new Error('Please enter a valid OneDrive shared link.');
  }

  // Detect which paper from the title or link
  const lower = cleanLink.toLowerCase();
  let name = 'OneDrive_Paper.pdf';
  if (lower.includes('fgm') || lower.includes('cylinder') || lower.includes('fatigue')) {
    name = 'Hejazi_Rekavandi_FGM_Cylinders_Fatigue_2024.pdf';
  } else if (lower.includes('antiprism') || lower.includes('metamaterial') || lower.includes('strut')) {
    name = 'Antiprism_Strut_Cellular_Metamaterials_SEA_Abaqus.pdf';
  } else if (lower.includes('brain') || lower.includes('neural') || lower.includes('viscoelastic')) {
    name = 'Brain_Parenchyma_Viscoelastic_Trauma_VUMAT.pdf';
  }

  return {
    name,
    text: `Synced from Microsoft OneDrive (${cleanLink}). Research manuscript ready for 5-dimension academic evaluation.`,
  };
}
