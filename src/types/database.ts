export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          actor_id: string | null
          created_at: string
          entity_id: string | null
          event_data: Json
          event_type: string
          id: number
          submission_id: string | null
          verification_request_id: string | null
          visibility: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          event_data?: Json
          event_type: string
          id?: never
          submission_id?: string | null
          verification_request_id?: string | null
          visibility?: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          event_data?: Json
          event_type?: string
          id?: never
          submission_id?: string | null
          verification_request_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      breeders: {
        Row: {
          breeder_kind: string | null
          country_code: string | null
          created_at: string
          id: string
        }
        Insert: {
          breeder_kind?: string | null
          country_code?: string | null
          created_at?: string
          id: string
        }
        Update: {
          breeder_kind?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeders_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_evidence: {
        Row: {
          claim_id: string
          created_at: string
          excerpt: string | null
          id: string
          locator: string | null
          notes: string | null
          source_document_id: string
          stance: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          excerpt?: string | null
          id?: string
          locator?: string | null
          notes?: string | null
          source_document_id: string
          stance: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          locator?: string | null
          notes?: string | null
          source_document_id?: string
          stance?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_evidence_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          asserted_by: string | null
          confidence: number | null
          created_at: string
          id: string
          object_boolean: boolean | null
          object_date: string | null
          object_entity_id: string | null
          object_number: number | null
          object_text: string | null
          predicate: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subject_entity_id: string
          updated_at: string
        }
        Insert: {
          asserted_by?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          object_boolean?: boolean | null
          object_date?: string | null
          object_entity_id?: string | null
          object_number?: number | null
          object_text?: string | null
          predicate: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject_entity_id: string
          updated_at?: string
        }
        Update: {
          asserted_by?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          object_boolean?: boolean | null
          object_date?: string | null
          object_entity_id?: string | null
          object_number?: number | null
          object_text?: string | null
          predicate?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject_entity_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_object_entity_id_fkey"
            columns: ["object_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_subject_entity_id_fkey"
            columns: ["subject_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_submissions: {
        Row: {
          created_at: string
          description: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submission_type: string
          submitted_at: string | null
          submitted_by: string
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submission_type: string
          submitted_at?: string | null
          submitted_by: string
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submission_type?: string
          submitted_at?: string | null
          submitted_by?: string
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      cultivars: {
        Row: {
          created_at: string
          id: string
          origin_country_code: string | null
          year_introduced: number | null
        }
        Insert: {
          created_at?: string
          id: string
          origin_country_code?: string | null
          year_introduced?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          origin_country_code?: string | null
          year_introduced?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cultivars_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      cuts: {
        Row: {
          created_at: string
          cultivar_id: string | null
          held_by_entity_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          cultivar_id?: string | null
          held_by_entity_id?: string | null
          id: string
        }
        Update: {
          created_at?: string
          cultivar_id?: string | null
          held_by_entity_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuts_cultivar_id_fkey"
            columns: ["cultivar_id"]
            isOneToOne: false
            referencedRelation: "cultivars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuts_held_by_entity_id_fkey"
            columns: ["held_by_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_candidates: {
        Row: {
          candidate_data: Json
          candidate_type: string
          created_at: string
          deduplication_key: string | null
          id: string
          research_job_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          candidate_data: Json
          candidate_type: string
          created_at?: string
          deduplication_key?: string | null
          id?: string
          research_job_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          candidate_data?: Json
          candidate_type?: string
          created_at?: string
          deduplication_key?: string | null
          id?: string
          research_job_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_candidates_research_job_id_fkey"
            columns: ["research_job_id"]
            isOneToOne: false
            referencedRelation: "research_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_queue: {
        Row: {
          available_at: string
          created_at: string
          entity_id: string | null
          id: string
          idempotency_key: string | null
          priority: number
          query: string
          requested_by: string | null
          source_registry_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          available_at?: string
          created_at?: string
          entity_id?: string | null
          id?: string
          idempotency_key?: string | null
          priority?: number
          query: string
          requested_by?: string | null
          source_registry_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          available_at?: string
          created_at?: string
          entity_id?: string | null
          id?: string
          idempotency_key?: string | null
          priority?: number
          query?: string
          requested_by?: string | null
          source_registry_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_queue_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovery_queue_source_registry_id_fkey"
            columns: ["source_registry_id"]
            isOneToOne: false
            referencedRelation: "source_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          canonical_name: string
          created_at: string
          description: string | null
          entity_type: string
          id: string
          public_id: string
          published_at: string | null
          slug: string | null
          status: string
          updated_at: string
        }
        Insert: {
          canonical_name: string
          created_at?: string
          description?: string | null
          entity_type: string
          id?: string
          public_id: string
          published_at?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          canonical_name?: string
          created_at?: string
          description?: string | null
          entity_type?: string
          id?: string
          public_id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      entity_merges: {
        Row: {
          approved_by: string
          id: string
          identity_candidate_id: string | null
          merged_at: string
          rationale: string
          reversal_reason: string | null
          reversed_at: string | null
          reversed_by: string | null
          source_entity_id: string
          target_entity_id: string
        }
        Insert: {
          approved_by: string
          id?: string
          identity_candidate_id?: string | null
          merged_at?: string
          rationale: string
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          source_entity_id: string
          target_entity_id: string
        }
        Update: {
          approved_by?: string
          id?: string
          identity_candidate_id?: string | null
          merged_at?: string
          rationale?: string
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          source_entity_id?: string
          target_entity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_merges_identity_candidate_id_fkey"
            columns: ["identity_candidate_id"]
            isOneToOne: false
            referencedRelation: "identity_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_merges_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_merges_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_names: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          language_code: string | null
          name: string
          name_type: string
          normalized_name: string
          source_document_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          language_code?: string | null
          name: string
          name_type: string
          normalized_name: string
          source_document_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          language_code?: string | null
          name?: string
          name_type?: string
          normalized_name?: string
          source_document_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_names_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_names_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      hypotheses: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hypothesis_claims: {
        Row: {
          claim_id: string
          created_at: string
          hypothesis_id: string
          role: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          hypothesis_id: string
          role?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          hypothesis_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "hypothesis_claims_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hypothesis_claims_hypothesis_id_fkey"
            columns: ["hypothesis_id"]
            isOneToOne: false
            referencedRelation: "hypotheses"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_candidates: {
        Row: {
          created_at: string
          id: string
          left_entity_id: string
          reasons: Json
          reviewed_at: string | null
          reviewed_by: string | null
          right_entity_id: string
          score: number | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          left_entity_id: string
          reasons?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          right_entity_id: string
          score?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          left_entity_id?: string
          reasons?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          right_entity_id?: string
          score?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_candidates_left_entity_id_fkey"
            columns: ["left_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_candidates_right_entity_id_fkey"
            columns: ["right_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      lineage_evidence: {
        Row: {
          created_at: string
          excerpt: string | null
          id: string
          lineage_relationship_id: string
          locator: string | null
          notes: string | null
          source_document_id: string
          stance: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          id?: string
          lineage_relationship_id: string
          locator?: string | null
          notes?: string | null
          source_document_id: string
          stance: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          id?: string
          lineage_relationship_id?: string
          locator?: string | null
          notes?: string | null
          source_document_id?: string
          stance?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineage_evidence_lineage_relationship_id_fkey"
            columns: ["lineage_relationship_id"]
            isOneToOne: false
            referencedRelation: "lineage_relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lineage_evidence_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      lineage_relationships: {
        Row: {
          child_entity_id: string
          confidence: number | null
          created_at: string
          id: string
          parent_entity_id: string
          parent_role: string
          status: string
          updated_at: string
        }
        Insert: {
          child_entity_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          parent_entity_id: string
          parent_role: string
          status?: string
          updated_at?: string
        }
        Update: {
          child_entity_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          parent_entity_id?: string
          parent_role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineage_relationships_child_entity_id_fkey"
            columns: ["child_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lineage_relationships_parent_entity_id_fkey"
            columns: ["parent_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_entity_links: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          organization_id: string
          relationship_type: string
          status: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          organization_id: string
          relationship_type: string
          status?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          organization_id?: string
          relationship_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_entity_links_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_entity_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          organization_type: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id: string
          organization_type: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization_type?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      phenotypes: {
        Row: {
          created_at: string
          cultivar_id: string | null
          id: string
          selection_label: string | null
        }
        Insert: {
          created_at?: string
          cultivar_id?: string | null
          id: string
          selection_label?: string | null
        }
        Update: {
          created_at?: string
          cultivar_id?: string | null
          id?: string
          selection_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phenotypes_cultivar_id_fkey"
            columns: ["cultivar_id"]
            isOneToOne: false
            referencedRelation: "cultivars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phenotypes_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      research_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: number
          research_job_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: never
          research_job_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: never
          research_job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_events_research_job_id_fkey"
            columns: ["research_job_id"]
            isOneToOne: false
            referencedRelation: "research_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      research_jobs: {
        Row: {
          attempts: number
          created_at: string
          discovery_queue_id: string | null
          error_message: string | null
          finished_at: string | null
          id: string
          idempotency_key: string
          job_type: string
          max_attempts: number
          payload: Json
          result_summary: Json | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          discovery_queue_id?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key: string
          job_type: string
          max_attempts?: number
          payload?: Json
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          discovery_queue_id?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string
          job_type?: string
          max_attempts?: number
          payload?: Json
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_jobs_discovery_queue_id_fkey"
            columns: ["discovery_queue_id"]
            isOneToOne: false
            referencedRelation: "discovery_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      source_documents: {
        Row: {
          content_hash: string | null
          created_at: string
          document_url: string | null
          extractor_version: string | null
          id: string
          metadata: Json
          parent_document_id: string | null
          published_at: string | null
          relationship_type: string
          retrieved_at: string
          source_id: string
          title: string | null
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          document_url?: string | null
          extractor_version?: string | null
          id?: string
          metadata?: Json
          parent_document_id?: string | null
          published_at?: string | null
          relationship_type?: string
          retrieved_at?: string
          source_id: string
          title?: string | null
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          document_url?: string | null
          extractor_version?: string | null
          id?: string
          metadata?: Json
          parent_document_id?: string | null
          published_at?: string | null
          relationship_type?: string
          retrieved_at?: string
          source_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_registry: {
        Row: {
          access_mode: string
          base_url: string | null
          citation_required: boolean
          created_at: string
          display_name: string
          domain: string
          id: string
          policy_checked_at: string | null
          policy_status: string
          rate_limit_notes: string | null
          robots_url: string | null
          source_type: string
          terms_url: string | null
          updated_at: string
        }
        Insert: {
          access_mode: string
          base_url?: string | null
          citation_required?: boolean
          created_at?: string
          display_name: string
          domain: string
          id?: string
          policy_checked_at?: string | null
          policy_status?: string
          rate_limit_notes?: string | null
          robots_url?: string | null
          source_type: string
          terms_url?: string | null
          updated_at?: string
        }
        Update: {
          access_mode?: string
          base_url?: string | null
          citation_required?: boolean
          created_at?: string
          display_name?: string
          domain?: string
          id?: string
          policy_checked_at?: string | null
          policy_status?: string
          rate_limit_notes?: string | null
          robots_url?: string | null
          source_type?: string
          terms_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          notes: string | null
          publisher: string | null
          source_type: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          publisher?: string | null
          source_type: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          publisher?: string | null
          source_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      submission_entity_links: {
        Row: {
          created_at: string
          entity_id: string
          relationship_type: string
          submission_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          relationship_type: string
          submission_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          relationship_type?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_entity_links_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_entity_links_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_evidence: {
        Row: {
          created_at: string
          id: string
          source_document_id: string | null
          statement: string | null
          storage_path: string | null
          submission_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_document_id?: string | null
          statement?: string | null
          storage_path?: string | null
          submission_id: string
        }
        Update: {
          created_at?: string
          id?: string
          source_document_id?: string | null
          statement?: string | null
          storage_path?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_evidence_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_evidence_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      traditional_populations: {
        Row: {
          country_code: string | null
          created_at: string
          id: string
          region_name: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id: string
          region_name?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          region_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traditional_populations_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_events: {
        Row: {
          actor_id: string | null
          created_at: string
          from_status: string | null
          id: number
          note: string | null
          to_status: string
          verification_request_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          note?: string | null
          to_status: string
          verification_request_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          note?: string | null
          to_status?: string
          verification_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_events_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_evidence: {
        Row: {
          created_at: string
          id: string
          source_document_id: string | null
          statement: string | null
          storage_path: string | null
          submitted_by: string
          verification_request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_document_id?: string | null
          statement?: string | null
          storage_path?: string | null
          submitted_by: string
          verification_request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          source_document_id?: string | null
          statement?: string | null
          storage_path?: string | null
          submitted_by?: string
          verification_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_evidence_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_evidence_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          entity_id: string
          id: string
          organization_id: string | null
          request_type: string
          requested_by: string
          statement: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          entity_id: string
          id?: string
          organization_id?: string | null
          request_type: string
          requested_by: string
          statement: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          entity_id?: string
          id?: string
          organization_id?: string | null
          request_type?: string
          requested_by?: string
          statement?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

