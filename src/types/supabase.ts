export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      COMMENTS: {
        Row: {
          commentImg: string | null
          content: string
          created_at: string
          id: string
          postId: string
          writtenId: string
        }
        Insert: {
          commentImg?: string | null
          content: string
          created_at?: string
          id: string
          postId: string
          writtenId: string
        }
        Update: {
          commentImg?: string | null
          content?: string
          created_at?: string
          id?: string
          postId?: string
          writtenId?: string
        }
        Relationships: [
          {
            foreignKeyName: "COMMENTS_postId_fkey"
            columns: ["postId"]
            referencedRelation: "POSTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "COMMENTS_writtenId_fkey"
            columns: ["writtenId"]
            referencedRelation: "USERS"
            referencedColumns: ["id"]
          }
        ]
      }
      "ITEM-BOOKMARK": {
        Row: {
          id: string
          leftWallpaperId: string
          rightWallpaperId: string
          tileId: string
          userId: string
        }
        Insert: {
          id?: string
          leftWallpaperId: string
          rightWallpaperId: string
          tileId: string
          userId: string
        }
        Update: {
          id?: string
          leftWallpaperId?: string
          rightWallpaperId?: string
          tileId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ITEM-BOOKMARK_leftWallpaperId_fkey"
            columns: ["leftWallpaperId"]
            referencedRelation: "WALLPAPER"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ITEM-BOOKMARK_rightWallpaperId_fkey"
            columns: ["rightWallpaperId"]
            referencedRelation: "WALLPAPER"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ITEM-BOOKMARK_tileId_fkey"
            columns: ["tileId"]
            referencedRelation: "TILE"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ITEM-BOOKMARK_userId_fkey"
            columns: ["userId"]
            referencedRelation: "USERS"
            referencedColumns: ["id"]
          }
        ]
      }
      "POST-BOOKMARKS": {
        Row: {
          postId: string
          userId: string
        }
        Insert: {
          postId: string
          userId: string
        }
        Update: {
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "POST-BOOKMARKS_postId_fkey"
            columns: ["postId"]
            referencedRelation: "POSTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "POST-BOOKMARKS_userId_fkey"
            columns: ["userId"]
            referencedRelation: "USERS"
            referencedColumns: ["id"]
          }
        ]
      }
      POSTS: {
        Row: {
          bookmark: number
          content: string
          created_at: string
          id: string
          leftWallpaperId: string | null
          nickname: string | null
          postImage: string | null
          rightWallpaperId: string | null
          tileId: string | null
          title: string
          userId: string | null
        }
        Insert: {
          bookmark: number
          content: string
          created_at?: string
          id?: string
          leftWallpaperId?: string | null
          nickname?: string | null
          postImage?: string | null
          rightWallpaperId?: string | null
          tileId?: string | null
          title: string
          userId?: string | null
        }
        Update: {
          bookmark?: number
          content?: string
          created_at?: string
          id?: string
          leftWallpaperId?: string | null
          nickname?: string | null
          postImage?: string | null
          rightWallpaperId?: string | null
          tileId?: string | null
          title?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "POSTS_leftWallpaperId_fkey"
            columns: ["leftWallpaperId"]
            referencedRelation: "WALLPAPER"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "POSTS_rightWallpaperId_fkey"
            columns: ["rightWallpaperId"]
            referencedRelation: "WALLPAPER"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "POSTS_tileId_fkey"
            columns: ["tileId"]
            referencedRelation: "TILE"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "POSTS_userId_fkey"
            columns: ["userId"]
            referencedRelation: "USERS"
            referencedColumns: ["id"]
          }
        ]
      }
      RECOMMENTS: {
        Row: {
          commentId: string
          content: string
          created_at: string
          id: string
          writtenId: string
        }
        Insert: {
          commentId: string
          content: string
          created_at?: string
          id?: string
          writtenId: string
        }
        Update: {
          commentId?: string
          content?: string
          created_at?: string
          id?: string
          writtenId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RECOMMENTS_commentId_fkey"
            columns: ["commentId"]
            referencedRelation: "COMMENTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RECOMMENTS_writtenId_fkey"
            columns: ["writtenId"]
            referencedRelation: "USERS"
            referencedColumns: ["id"]
          }
        ]
      }
      TILE: {
        Row: {
          category: string[]
          id: string
          image: string
          texture: string
        }
        Insert: {
          category: string[]
          id?: string
          image: string
          texture: string
        }
        Update: {
          category?: string[]
          id?: string
          image?: string
          texture?: string
        }
        Relationships: []
      }
      USERS: {
        Row: {
          avatar_url: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          avatar_url: string
          email: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          avatar_url?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      WALLPAPER: {
        Row: {
          category: string[]
          id: string
          image: string
          texture: string
        }
        Insert: {
          category: string[]
          id?: string
          image: string
          texture: string
        }
        Update: {
          category?: string[]
          id?: string
          image?: string
          texture?: string
        }
        Relationships: []
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: Array<{
          size: number
          bucket_id: string
        }>
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: Array<{
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
export type Tables<
T extends keyof Database["public"]["Tables"],
A extends keyof Database["public"]["Tables"][T],
> = Database["public"]["Tables"][T][A];