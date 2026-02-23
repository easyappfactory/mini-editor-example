import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api/v1',
    apis: [
      './src/app/api/v1/**/*.ts', 
      './src/app/api/v1/**/*.js',
      './src/app/api/**/*.ts',
    ],
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Wedding Invitation API',
        version: '1.0.0',
        description:
          '블록 기반 모바일 청첩장 에디터의 API 문서입니다. 프로젝트 CRUD, 방명록, 프리미엄, 이미지 업로드, 검색, 쿠폰 기능을 제공합니다.',
      },
      tags: [
        { name: 'Projects', description: '프로젝트 CRUD' },
        { name: 'Guestbook', description: '방명록 CRUD' },
        { name: 'Premium', description: '프리미엄 기능 관리' },
        { name: 'Upload', description: '이미지 업로드' },
        { name: 'Search', description: '카카오 주소/장소 검색 프록시' },
        { name: 'Coupons', description: '쿠폰 사용' },
        { name: 'RSVP', description: '참석 의사 제출 및 조회' },
      ],
      components: {
        schemas: {
          Block: {
            type: 'object',
            required: ['id', 'type', 'content'],
            properties: {
              id: { type: 'string', description: '고유 ID' },
              type: {
                type: 'string',
                enum: [
                  'text',
                  'image',
                  'image_grid',
                  'couple_info',
                  'date',
                  'map',
                  'account',
                  'guestbook',
                  'dday',
                ],
                description: '블록 타입',
              },
              content: {
                oneOf: [
                  { type: 'string' },
                  { type: 'object' },
                ],
                description: '블록 내용 (타입에 따라 다름)',
              },
              styles: {
                type: 'object',
                properties: {
                  color: { type: 'string' },
                  backgroundColor: { type: 'string' },
                  align: { type: 'string', enum: ['left', 'center', 'right'] },
                  fontSize: { type: 'string' },
                },
              },
            },
          },
          GlobalTheme: {
            type: 'object',
            required: ['backgroundColor', 'fontFamily', 'primaryColor'],
            properties: {
              backgroundColor: { type: 'string' },
              fontFamily: { type: 'string' },
              primaryColor: { type: 'string' },
            },
          },
          ProjectData: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              blocks: {
                type: 'array',
                items: { $ref: '#/components/schemas/Block' },
              },
              theme: { $ref: '#/components/schemas/GlobalTheme' },
              title: { type: 'string' },
            },
          },
          GuestbookEntry: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              project_id: { type: 'string' },
              author_name: { type: 'string' },
              message: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string', description: '에러 메시지' },
            },
          },
          ApiResponse: {
            type: 'object',
            required: ['success', 'code', 'message'],
            properties: {
              success: {
                type: 'boolean',
                description: '성공 여부',
              },
              code: {
                type: 'string',
                description: '커스텀 에러 코드 (예: SUCCESS, COMMON_400, PROJECT_001)',
              },
              message: {
                type: 'string',
                description: '사용자에게 보여줄 메시지',
              },
              data: {
                type: 'object',
                description: '실제 결과 데이터 (실패 시 null)',
              },
            },
          },
        },
      }
    }
  });
  return spec;
};
