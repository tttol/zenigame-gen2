# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定

**重要**: このプロジェクトでは、Claude Codeとのやり取りは常に日本語で行ってください。ユーザーが英語でプロンプトを送信しても、回答、説明、コメントなどすべて日本語で生成してください。

## Common Commands

- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest
- `npm run debug` - Start development server with Node.js inspector

## Architecture Overview

ZENIGAME is a personal finance management app built with:

- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: AWS Amplify Gen 2 with AWS CDK
- **Authentication**: Amazon Cognito with passwordless (WebAuthn/FIDO2) authentication
- **Database**: Amplify Data (GraphQL API with DynamoDB)
- **Testing**: Vitest with React Testing Library

### Key Architecture Patterns

- **Component Structure**: Components are in `app/component/` with co-located test files (`.test.tsx`)
- **Business Logic**: Authentication logic in `app/logic/Authentication.ts`
- **Data Models**: TypeScript interfaces in `app/model/`
- **AWS Resources**: Amplify backend configuration in `amplify/` directory
- **Passwordless Auth**: Uses `amazon-cognito-passwordless-auth` library for WebAuthn/passkey support

### Important Files

- `amplify/backend.ts` - Main backend configuration with Cognito and passwordless auth setup
- `app/page.tsx` - Main application page with Header, AppVersion, and Data components
- `app/component/Data.tsx` - Core data management component
- `vitest.config.ts` - Test configuration with jsdom environment

### Environment Variables

- `NEXT_FRONTEND_URL` - Frontend URL for CORS (defaults to http://localhost:3000)
- `NEXT_FRONTEND_HOST` - Frontend host for WebAuthn relying party (defaults to localhost)

## Development Notes

- The app uses WebAuthn/FIDO2 for passwordless authentication
- All components use Tailwind CSS for styling
- AWS Amplify outputs are in `amplify_outputs.json`
- Test files are co-located with components using `.test.tsx` extension