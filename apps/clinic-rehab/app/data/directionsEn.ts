import { Bone, Brain, Activity, Speech, Baby, LucideIcon } from "lucide-react";

export interface DirectionItemEn {
  id: number;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  expandedDesc: string;
  examples: string;
  colorClass: string;
  colSpanClass: string;
}

export const directionsData: DirectionItemEn[] = [
  {
    id: 1,
    icon: Bone,
    title: "Musculoskeletal System",
    shortDesc: "Lesions of the musculoskeletal system of varying severity.",
    expandedDesc: "Our specialists conduct comprehensive work to restore the range of motion, muscle strength, and coordination. We use modern methods of kinesitherapy and mechanotherapy to improve body biomechanics. Special attention is paid to verticalization and learning independent walking. Classes are aimed at preventing contractures and joint deformities. The program is adapted to the child's age and individual physical capabilities.",
    examples: "Scoliosis, hip dysplasia, torticollis, consequences of injuries and fractures, arthrogryposis, congenital anomalies of limb development.",
    colorClass: "text-blue-500",
    colSpanClass: "md:col-span-2",
  },
  {
    id: 2,
    icon: Brain,
    title: "CNS and Cerebral Palsy",
    shortDesc: "Lesions of the central and peripheral nervous system, including CP.",
    expandedDesc: "Rehabilitation for neurological disorders requires a systemic approach and early intervention. We focus on neuromotor development, stimulating new motor skills, and reducing spasticity. The team uses neurodevelopmental therapy techniques to form correct motor patterns. An important component is teaching parents the correct positioning of the child at home. Our goal is the child's maximum independence in daily life.",
    examples: "Cerebral palsy (all forms), consequences of neuroinfections (encephalitis, meningitis), hydrocephalus, consequences of hypoxia during childbirth, obstetric paresis.",
    colorClass: "text-amber-500",
    colSpanClass: "md:col-span-2",
  },
  {
    id: 3,
    icon: Activity,
    title: "Psychological Development",
    shortDesc: "Psychological development disorders and behavioral disorders.",
    expandedDesc: "Psychological support aims to harmonize the child's emotional state and develop their cognitive functions. We work on improving concentration, memory, thinking, and imagination. Specialists use play therapy, art therapy, and sensory integration elements. An important stage is the correction of behavioral manifestations, overcoming fears and anxiety. Psychological support is also provided to families to create a favorable microclimate.",
    examples: "Autism spectrum disorders (ASD), attention deficit hyperactivity disorder (ADHD), mental retardation, anxiety disorders, emotional lability.",
    colorClass: "text-emerald-500",
    colSpanClass: "md:col-span-2",
  },
  {
    id: 4,
    icon: Speech,
    title: "Speech Development",
    shortDesc: "Delay or impairment of speech development, communication skills disorders.",
    expandedDesc: "The work of a speech pathologist covers not only sound pronunciation but also the comprehensive development of speech and communication. We conduct speech therapy massage to stimulate the articulatory apparatus. Classes include articulation exercises, development of phonemic hearing, and vocabulary enrichment. Methods of stimulating pre-speech development are applied for infants. In the absence of speech, alternative communication systems are introduced.",
    examples: "Alalia, dysarthria, dyslalia, stuttering, delayed speech development, general speech underdevelopment.",
    colorClass: "text-purple-500",
    colSpanClass: "md:col-span-3",
  },
  {
    id: 5,
    icon: Baby,
    title: "Congenital Anomalies",
    shortDesc: "Comprehensive rehabilitation of children with congenital anomalies.",
    expandedDesc: "Children with genetic and congenital syndromes require long-term and multidisciplinary support. Our team develops individual early intervention routes from the first months of life. We stimulate motor, sensory, and intellectual development according to the baby's capabilities. The program includes the prevention of secondary complications and the selection of necessary assistive devices. The main task is to unlock the child's potential and help them adapt to society.",
    examples: "Down syndrome, Prader-Willi syndrome, SMA (spinal muscular atrophy), Duchenne muscular dystrophy, physical rehabilitation stage after surgical treatment of defects.",
    colorClass: "text-pink-500",
    colSpanClass: "md:col-span-3",
  }
];
