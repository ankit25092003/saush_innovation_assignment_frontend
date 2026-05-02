import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../redux/slices/projectSlice';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme';

const ProjectsScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { dispatch(fetchProjects({})); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProjects({ search: searchQuery }));
    setRefreshing(false);
  }, [searchQuery]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    clearTimeout(handleSearch.t);
    handleSearch.t = setTimeout(() => dispatch(fetchProjects({ search: text })), 400);
  };

  const openCreate = () => { setEditingProject(null); setTitle(''); setDescription(''); setModalVisible(true); };
  const openEdit = (p) => { setEditingProject(p); setTitle(p.title); setDescription(p.description||''); setModalVisible(true); };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Error','Title required'); return; }
    if (editingProject) await dispatch(updateProject({ id: editingProject.id, data: { title: title.trim(), description: description.trim() } }));
    else await dispatch(createProject({ title: title.trim(), description: description.trim() }));
    setModalVisible(false);
  };

  const handleDelete = (p) => {
    Alert.alert('Delete', `Delete "${p.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteProject(p.id)) },
    ]);
  };

  const getStats = (tasks=[]) => {
    const t = tasks.length, c = tasks.filter(t=>t.status==='completed').length;
    return { t, c, p: t>0?(c/t)*100:0 };
  };

  const renderCard = ({ item, index }) => {
    const s = getStats(item.tasks);
    const gc = index%3===0?[colors.gradientStart,colors.gradientEnd]:index%3===1?[colors.gradientSecondaryStart,colors.gradientSecondaryEnd]:['#06B6D4','#22D3EE'];
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ProjectDetail',{projectId:item.id,projectTitle:item.title})} onLongPress={() => handleDelete(item)} style={styles.cardWrap}>
        <View style={[styles.card,{backgroundColor:colors.card,borderColor:colors.border}]}>
          <LinearGradient colors={gc} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.accent}/>
          <View style={styles.cardBody}>
            <View style={styles.cardHead}>
              <Text style={[styles.cardTitle,{color:colors.text}]} numberOfLines={1}>{item.title}</Text>
              <TouchableOpacity onPress={()=>openEdit(item)}><Text style={{fontSize:16}}>✏️</Text></TouchableOpacity>
            </View>
            {item.description?<Text style={[styles.cardDesc,{color:colors.textSecondary}]} numberOfLines={2}>{item.description}</Text>:null}
            <View style={styles.progHead}><Text style={[styles.progLabel,{color:colors.textSecondary}]}>{s.c}/{s.t} tasks</Text><Text style={[styles.progPct,{color:colors.primary}]}>{Math.round(s.p)}%</Text></View>
            <View style={[styles.progBg,{backgroundColor:colors.borderLight}]}><LinearGradient colors={gc} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.progFill,{width:`${s.p}%`}]}/></View>
            <Text style={[styles.dateText,{color:colors.textTertiary}]}>Created {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <View style={[styles.topBar,{backgroundColor:colors.surface,borderBottomColor:colors.border}]}>
        <View><Text style={[styles.greet,{color:colors.textSecondary}]}>Welcome back,</Text><Text style={[styles.name,{color:colors.text}]}>{user?.name||'User'} 👋</Text></View>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={()=>dispatch(toggleTheme())} style={[styles.iconBtn,{backgroundColor:colors.primarySurface}]}><Text style={{fontSize:20}}>{isDark?'☀️':'🌙'}</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>Alert.alert('Logout','Sure?',[{text:'Cancel',style:'cancel'},{text:'Logout',style:'destructive',onPress:()=>dispatch(logout())}])} style={[styles.iconBtn,{backgroundColor:colors.errorSurface}]}><Text style={{fontSize:18}}>🚪</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchWrap}><Input placeholder="🔍 Search projects..." value={searchQuery} onChangeText={handleSearch} style={{marginBottom:0}}/></View>
      <View style={styles.statsRow}>
        <View style={[styles.stat,{backgroundColor:colors.primarySurface}]}><Text style={[styles.statN,{color:colors.primary}]}>{projects.length}</Text><Text style={[styles.statL,{color:colors.textSecondary}]}>Projects</Text></View>
        <View style={[styles.stat,{backgroundColor:colors.successSurface}]}><Text style={[styles.statN,{color:colors.success}]}>{projects.reduce((a,p)=>a+(p.tasks?.filter(t=>t.status==='completed').length||0),0)}</Text><Text style={[styles.statL,{color:colors.textSecondary}]}>Done</Text></View>
        <View style={[styles.stat,{backgroundColor:colors.warningSurface}]}><Text style={[styles.statN,{color:colors.warning}]}>{projects.reduce((a,p)=>a+(p.tasks?.filter(t=>t.status==='pending').length||0),0)}</Text><Text style={[styles.statL,{color:colors.textSecondary}]}>Pending</Text></View>
      </View>
      <FlatList data={projects} renderItem={renderCard} keyExtractor={i=>i.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListEmptyComponent={!loading?<EmptyState icon={<Text style={{fontSize:48}}>📂</Text>} title="No Projects Yet" subtitle="Create your first project" actionLabel="+ Create" onAction={openCreate}/>:null}/>
      <TouchableOpacity activeOpacity={0.85} onPress={openCreate}><LinearGradient colors={[colors.gradientStart,colors.gradientEnd]} style={styles.fab}><Text style={styles.fabT}>+</Text></LinearGradient></TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={()=>setModalVisible(false)}>
        <View style={[styles.overlay,{backgroundColor:colors.overlay}]}>
          <View style={[styles.modal,{backgroundColor:colors.surface}]}>
            <Text style={[styles.modalT,{color:colors.text}]}>{editingProject?'Edit Project':'New Project'}</Text>
            <Input label="Title *" placeholder="Project title" value={title} onChangeText={setTitle}/>
            <Input label="Description" placeholder="Optional description" value={description} onChangeText={setDescription} multiline numberOfLines={3}/>
            <View style={styles.modalActs}><Button title="Cancel" variant="ghost" onPress={()=>setModalVisible(false)} style={{flex:1}}/><Button title={editingProject?'Update':'Create'} onPress={handleSave} loading={loading} style={{flex:1}}/></View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{flex:1},
  topBar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:spacing.xl,paddingTop:spacing['4xl']+8,paddingBottom:spacing.base,borderBottomWidth:1},
  greet:{fontSize:fontSize.sm,fontWeight:fontWeight.medium},
  name:{fontSize:fontSize.xl,fontWeight:fontWeight.bold,marginTop:2},
  topActions:{flexDirection:'row',gap:spacing.sm},
  iconBtn:{width:42,height:42,borderRadius:borderRadius.lg,justifyContent:'center',alignItems:'center'},
  searchWrap:{paddingHorizontal:spacing.xl,paddingTop:spacing.md},
  statsRow:{flexDirection:'row',paddingHorizontal:spacing.xl,paddingVertical:spacing.md,gap:spacing.sm},
  stat:{flex:1,borderRadius:borderRadius.lg,paddingVertical:spacing.md,alignItems:'center'},
  statN:{fontSize:fontSize.xl,fontWeight:fontWeight.bold},
  statL:{fontSize:fontSize.xs,fontWeight:fontWeight.medium,marginTop:2},
  list:{paddingHorizontal:spacing.xl,paddingBottom:100},
  cardWrap:{marginBottom:spacing.md},
  card:{borderRadius:borderRadius.xl,borderWidth:1,overflow:'hidden',elevation:2,shadowOffset:{width:0,height:2},shadowOpacity:0.1,shadowRadius:6},
  accent:{height:4},
  cardBody:{padding:spacing.base},
  cardHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:spacing.xs},
  cardTitle:{fontSize:fontSize.lg,fontWeight:fontWeight.semibold,flex:1,marginRight:spacing.sm},
  cardDesc:{fontSize:fontSize.sm,lineHeight:20,marginBottom:spacing.sm,color:'#9CA3AF'},
  progHead:{flexDirection:'row',justifyContent:'space-between',marginBottom:spacing.xs},
  progLabel:{fontSize:fontSize.xs,fontWeight:fontWeight.medium},
  progPct:{fontSize:fontSize.xs,fontWeight:fontWeight.bold},
  progBg:{height:6,borderRadius:3,overflow:'hidden',marginBottom:spacing.sm},
  progFill:{height:'100%',borderRadius:3},
  dateText:{fontSize:fontSize.xs},
  fab:{position:'absolute',bottom:24,right:24,width:60,height:60,borderRadius:30,justifyContent:'center',alignItems:'center',elevation:8},
  fabT:{color:'#FFF',fontSize:28,fontWeight:fontWeight.bold,marginTop:-2},
  overlay:{flex:1,justifyContent:'flex-end'},
  modal:{borderTopLeftRadius:borderRadius['2xl'],borderTopRightRadius:borderRadius['2xl'],padding:spacing.xl,paddingBottom:spacing['3xl']},
  modalT:{fontSize:fontSize.xl,fontWeight:fontWeight.bold,marginBottom:spacing.xl},
  modalActs:{flexDirection:'row',gap:spacing.md,marginTop:spacing.md},
});

export default ProjectsScreen;
