// shared/utils/serverStorage.ts
import { Block, GlobalTheme } from "@/shared/types/block";
import { ProjectData, ProjectStorage } from "./storage";
import { supabase } from "./supabase";

// Supabase를 사용한 프로젝트 스토리지 구현
class SupabaseProjectStorage implements ProjectStorage {
  private readonly tableName = 'projects';

  async create(blocks: Block[], theme: GlobalTheme): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);
    
    const { error } = await supabase
      .from(this.tableName)
      .insert({
        id,
        blocks: blocks as unknown as Record<string, unknown>,
        theme: theme as unknown as Record<string, unknown>,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('프로젝트 생성 오류:', error);
      throw new Error(`프로젝트 생성에 실패했습니다: ${error.message}`);
    }

    return id;
  }

  async update(id: string, blocks: Block[], theme: GlobalTheme): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        blocks: blocks as unknown as Record<string, unknown>,
        theme: theme as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id');

    if (error) {
      throw new Error(`프로젝트 업데이트에 실패했습니다: ${error.message}`);
    }

    // 업데이트된 행이 없으면 false 반환 (프로젝트가 존재하지 않음)
    return data && data.length > 0;
  }

  async load(id: string): Promise<ProjectData | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('blocks, theme')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터를 찾을 수 없음
        return null;
      }
      console.error('프로젝트 조회 오류:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // JSONB에서 타입 안전하게 변환
    return {
      blocks: data.blocks as Block[],
      theme: data.theme as GlobalTheme,
    };
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('프로젝트 존재 확인 오류:', error);
      return false;
    }

    return !!data;
  }
}

// 싱글톤 인스턴스 (서버 사이드에서만 사용)
export const serverStorage: ProjectStorage = new SupabaseProjectStorage();
