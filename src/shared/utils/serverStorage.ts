import { Block, GlobalTheme } from "@/shared/types/block";
import { ProjectData, ProjectListItem, ProjectStorage } from "./storage";
import { supabase } from "./supabase";

// Supabase를 사용한 프로젝트 스토리지 구현
class SupabaseProjectStorage implements ProjectStorage {
  private readonly tableName = 'project';

  // 기본 제목 생성 (이름없는 청첩장 1, 2...) — userId 범위 내에서 계산
  private async generateDefaultTitle(userId?: string): Promise<string> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .ilike('title', '이름없는 청첩장%');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { count, error } = await query;

      if (error) {
        console.error('기본 제목 생성 중 오류:', error);
        return '이름없는 청첩장';
      }

      const nextNum = (count || 0) + 1;
      return nextNum === 1 ? '이름없는 청첩장' : `이름없는 청첩장 ${nextNum}`;
    } catch {
      return '이름없는 청첩장';
    }
  }

  async create(blocks: Block[], theme: GlobalTheme, title?: string, userId?: string): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);

    let finalTitle = title;
    if (!finalTitle) {
      finalTitle = await this.generateDefaultTitle(userId);
    }

    const { error } = await supabase
      .from(this.tableName)
      .insert({
        id,
        title: finalTitle,
        blocks: blocks as unknown as Record<string, unknown>,
        theme: theme as unknown as Record<string, unknown>,
        user_id: userId ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('프로젝트 생성 오류:', error);
      throw new Error(`프로젝트 생성에 실패했습니다: ${error.message}`);
    }

    return id;
  }

  async update(id: string, blocks: Block[], theme: GlobalTheme, title?: string): Promise<boolean> {
    // 업데이트할 데이터 객체 생성
    const updateData: {
      blocks: Record<string, unknown>;
      theme: Record<string, unknown>;
      updated_at: string;
      title?: string;
    } = {
      blocks: blocks as unknown as Record<string, unknown>,
      theme: theme as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    };

    // 제목이 제공된 경우 (빈 문자열 포함)
    if (title !== undefined) {
      if (title === '') {
        // 제목을 지운 경우, 새로운 기본 제목 생성
        updateData.title = await this.generateDefaultTitle();
      } else {
        updateData.title = title;
      }
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
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
      .select('title, blocks, theme, user_id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('프로젝트 조회 오류:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      title: data.title || undefined,
      blocks: data.blocks as Block[],
      theme: data.theme as GlobalTheme,
      user_id: data.user_id ?? null,
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

  async list(userId?: string): Promise<ProjectListItem[]> {
    // userId 없으면 빈 배열 (비로그인 상태)
    if (!userId) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('id, title, blocks, theme, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('프로젝트 목록 조회 오류:', error);
      return [];
    }

    return data.map((project: { id: string; title: string | null; blocks: unknown; theme: unknown; created_at: string }) => ({
      id: project.id,
      title: project.title || '이름없는 청첩장',
      created_at: project.created_at,
      blocks: project.blocks as Block[],
      theme: project.theme as GlobalTheme,
    }));
  }
}

// 싱글톤 인스턴스 (서버 사이드에서만 사용)
export const serverStorage: ProjectStorage = new SupabaseProjectStorage();
